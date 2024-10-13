export enum ChatState {
  USER_SELECT_LANGUAGE,
  BOT_MSG_ENTER_VERSION,
  USER_SELECT_VERSION,
  BOT_MSG_ENTER_TEST,
  USER_UPLOAD_TEST,
  BOT_MSG_UPLOAD_COMPLETED,
  BOT_MSG_CONTAINER_STARTED,
  BOT_MSG_GENERATED_CODE,
  BOT_MSG_QUESTION_RETRY,
  USER_QUESTION_RETRY,
  BOT_MSG_FINISHED
}

const steps = Object.values(ChatState).filter(value => typeof value === 'number') as ChatState[];

export function isBefore(currentStep: ChatState, compareStep: ChatState): boolean {

  const currentIndex = steps.indexOf(currentStep);
  const compareIndex = steps.indexOf(compareStep);

  return compareIndex <= currentIndex;
}

export function getNextStep(currentStep: ChatState): ChatState {
  const currentIndex = steps.indexOf(currentStep);

  if (currentIndex !== -1 && currentIndex < steps.length - 1) {
    return steps[currentIndex + 1];
  }

  return ChatState.BOT_MSG_FINISHED;
}
