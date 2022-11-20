const GAME_SIGNATURE = require('./utils/constant');

/**
 * 다리 건너기 게임을 관리하는 클래스
 */
class BridgeGame {
  constructor(
    { bridgeRandomNumberGenerator, bridgeMaker, bridgeModel },
    { outputView, inputView, validator }
  ) {
    this.bridgeModel = bridgeModel;
    this.bridgeRandomNumberGenerator = bridgeRandomNumberGenerator;
    this.bridgeMaker = bridgeMaker;
    this.outputView = outputView;
    this.inputView = inputView;
    this.validator = validator;
    this.start();
    this.askBridgeSize();
  }

  start() {
    this.outputView.printStartMessage();
  }

  askBridgeSize() {
    this.inputView.readBridgeSize(this.makeBridge.bind(this));
  }

  makeBridge(size) {
    try {
      this.validator.checkBridgeSize(size);
    } catch (error) {
      this.outputView.printError(error.message);
      return;
    }

    const bridge = this.bridgeMaker.makeBridge(size, this.bridgeRandomNumberGenerator.generate);
    this.bridgeModel.setBridge(bridge);

    this.askMoveDirection();
  }

  askMoveDirection() {
    this.inputView.readMoving(this.move.bind(this));
  }

  /**
   * 사용자가 칸을 이동할 때 사용하는 메서드
   * <p>
   * 이동을 위해 필요한 메서드의 반환 값(return value), 인자(parameter)는 자유롭게 추가하거나 변경할 수 있다.
   */
  move(direction) {
    try {
      this.validator.checkMove(direction);
    } catch (error) {
      this.outputView.printError(error.message);
      return;
    }

    this.bridgeModel.move(direction);
    this.outputView.printMap(this.bridgeModel.trials);

    if (this.bridgeModel.status === GAME_SIGNATURE.gameOn) {
      this.askMoveDirection();
      return;
    }

    if (this.bridgeModel.status === GAME_SIGNATURE.gameFail) {
      this.gameCommand();
      return;
    }

    if (this.bridgeModel.status === GAME_SIGNATURE.gameSuccess) {
      this.end();
      return;
    }
  }

  end() {
    this.outputView.printResult(this.bridgeModel);
  }

  gameCommand() {
    this.inputView.readGameCommand(this.handleCommand.bind(this));
  }

  handleCommand(command) {
    try {
      this.validator.checkGameCommand(command);
    } catch (error) {
      this.outputView.printError(error.message);
      return;
    }

    if (command === 'R') {
      this.retry();

      return;
    }

    if (command === 'Q') {
      this.end();
    }
  }

  /**
   * 사용자가 게임을 다시 시도할 때 사용하는 메서드
   * <p>
   * 재시작을 위해 필요한 메서드의 반환 값(return value), 인자(parameter)는 자유롭게 추가하거나 변경할 수 있다.
   */
  retry() {
    this.bridgeModel.trialCount += 1;
    this.bridgeModel.trials = [];
    this.askMoveDirection();
  }
}

module.exports = BridgeGame;
