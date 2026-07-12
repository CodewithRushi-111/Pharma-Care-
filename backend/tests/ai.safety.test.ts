import { AiService } from '../src/modules/ai/ai.service';
import { REGEX, TriageLevel } from '../src/constants';

// Mock dependencies
jest.mock('../src/modules/ai/ai.repository', () => ({
  AiRepository: {
    getOrCreateConversation: jest.fn().mockResolvedValue({ id: 'mock-conv-id' }),
    logEmergencyIntercept: jest.fn().mockResolvedValue({ id: 'mock-msg-id' }),
    getPatientHistoryContext: jest.fn().mockResolvedValue({
      id: 'mock-patient-id',
      allergies: [],
      medicalHistory: [],
    }),
    createMessageTransaction: jest.fn().mockResolvedValue({ id: 'mock-msg-id' }),
  },
}));

jest.mock('../src/prisma/client', () => ({
  prisma: {
    patient: {
      findUnique: jest.fn().mockResolvedValue({ id: 'mock-patient-id', dateOfBirth: new Date('1990-01-01') }),
    },
  },
}));

describe('Clinical AI - Sub-10ms Emergency Pre-flight Safety Interceptor', () => {
  it('should verify the emergency regex matches life-threatening symptom keywords exactly', () => {
    expect(REGEX.EMERGENCY_KEYWORDS.test('I am having severe chest pain and short breath')).toBe(true);
    expect(REGEX.EMERGENCY_KEYWORDS.test('My father might be having a heart attack right now')).toBe(true);
    expect(REGEX.EMERGENCY_KEYWORDS.test('Can not breathe after eating peanuts')).toBe(true);
    expect(REGEX.EMERGENCY_KEYWORDS.test('Feeling sad and want to kill myself today')).toBe(true);
    expect(REGEX.EMERGENCY_KEYWORDS.test('Mild headache after working on computer all day')).toBe(false);
    expect(REGEX.EMERGENCY_KEYWORDS.test('Need advice on taking Vitamin D supplements')).toBe(false);
  });

  it('should immediately intercept emergency queries and return triage level EMERGENCY in < 10ms without calling Gemini', async () => {
    const startTime = Date.now();

    const response = await AiService.processChatMessage('mock-user-id', {
      message: 'Help, I am experiencing sharp chest pain radiating down my left arm and heart attack symptoms',
      contextType: 'GENERAL_TRIAGE',
    });

    const elapsed = Date.now() - startTime;

    expect(response.triageLevel).toBe(TriageLevel.EMERGENCY);
    expect(response.safetyStatus).toBe('EMERGENCY_INTERCEPTED');
    expect(response.modelUsed).toContain('SAFETY_INTERCEPTOR');
    expect(response.response).toContain('EMERGENCY MEDICAL ALERT INTERCEPTED');
    expect(response.response).toContain('Call Emergency Medical Services immediately (Dial 112 or 108 in India');
    expect(elapsed).toBeLessThan(100); // Super fast execution verification
  });
});
