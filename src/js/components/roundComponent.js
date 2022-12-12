import { Component } from './component.js';

import { $round } from '../views/selector.js';
import { MIN_ROUND } from '../common/const.js';
import { CustomError, ERROR_MESSAGE, InputMinInsufficientError } from "../common/error.js";
import { disableButton, displayBlock, displayNone } from "../common/util.js";

export class RoundComponent extends Component {
    constructor(stateService) {
        super(stateService);
        this._init();
        this._subscribe();
    }

    _init() {
        super._init();
    }

    _setEventListeners() {
        $round.button.addEventListener('click', () => this.submit());
        $round.input.addEventListener('keyup', e => this.submitByEnterKey(e));
    }

    _setRemoveListeners() {
        $round.input.removeEventListener('keyup', e => this.submitByEnterKey(e));
    }

    _initElement() {
        disableButton($round.button, false);
        displayNone([$round.container]);
    }

    _subscribe() {
        this._stateService.renderState.observers.push({ renderRound: () => this.#render() });
        this._stateService.resetState.observers.push({ reset: () => this._init() });
    }

    submit() {
        try {
            if (!this.#isValidated()) return;
        } catch (e) {
            if (!e instanceof CustomError) {
                throw e;
            }
            alert(e.message);
        }

        this._setRemoveListeners();
        this._stateService.raceState.round = +$round.input.value;
        this._stateService.renderState.renderRace = true;
        disableButton($round.button, true);
    }

    submitByEnterKey(e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        this.submit();
    }

    #render() {
        displayBlock([$round.container]);
    }

    #isValidated = () => {
        if (!$round.input.value || $round.input.value < MIN_ROUND) {
            throw new InputMinInsufficientError(ERROR_MESSAGE.InputMinInsufficient);
        }
        return true;
    }
}