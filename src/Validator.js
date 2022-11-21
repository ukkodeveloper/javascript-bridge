class Validator {
  REGEXES = new Map([
    ['bridgeSize', /^([3-9]|1[0-9]|20)$/],
    ['moving', /^[UD]$/],
    ['gameCommand', /^[RQ]$/],
  ]);

  ERROR_MESSAGES = new Map([
    ['bridgeSize', '[ERROR] 다리 길이는 3부터 20 사이의 숫자여야 합니다.'],
    ['moving', `[ERROR] 다리 이동에 대한 입력은 'U'와 'D'만 가능합니다.`],
    ['gameCommand', `[ERROR] 게임 재시도 및 종료에 대한 입력은 'R'과 'Q'만 가능합니다.`],
    ['category', `[개발자] REGEX_MAP에 해당 카테고리가 등록되어 있지 않습니다.`],
  ]);

  check(category) {
    if (!this.REGEXES.has(category)) {
      throw new Error(this.ERROR_MESSAGES.get(category), `(${category})`);
    }

    return (input) => {
      const regex = this.REGEXES.get(category);
      if (!regex.test(input)) throw new Error(this.ERROR_MESSAGES.get(category));
    };
  }

  checkBridgeSize = this.check('bridgeSize');

  checkMoving = this.check('moving');

  checkGameCommand = this.check('gameCommand');
}

module.exports = Validator;
