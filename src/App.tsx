import { useEffect, useRef, useState } from 'react';
import './App.css';
import { GamepadData } from './types/GamepadData';

const getGamepadData = (gamepad: Gamepad): GamepadData => {
  return {
    status: gamepad.connected ? 'connected' : 'disconnected',
    index: gamepad.index,
    id: gamepad.id,
    buttons_length: gamepad.connected ? gamepad.buttons.length : undefined,
    axes_length: gamepad.connected ? gamepad.axes.length : undefined,
  };
};

/**
 * Returns whether the browser supports the Gamepad API and the
 * `ongamepadconnected` event. True in Firefox, false in Chrome.
 * Chrome requires polling every frame to get the gamepad state.
 */
const hasAutoGamepad = (): boolean => 'ongamepadconnected' in window;

function App() {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);
  const gamepadsRef = useRef<Gamepad[]>([]);
  const [gamepadData, setGamepadData] = useState('Press a button on your gamepad');
  const animationRef = useRef<number>();

  useEffect(() => {
    if (gamepads.length === 0) {
      setGamepadData((_) => 'Press a button on your gamepad after connecting');
      return;
    }

    setGamepadData((_) => JSON.stringify(gamepads.map(getGamepadData)));
  }, [gamepads]);

  // Whenever gamepads changes, update the ref
  useEffect(() => {
    gamepadsRef.current = gamepads;
  }, [gamepads]);

  const handleGamepadConnected = (e: GamepadEvent): void => {
    setGamepads((gps) => [...gps, e.gamepad]);
  };

  const handleGamepadDisconnected = (e: GamepadEvent): void => {
    setGamepads((gps) => gps.filter((gamepad) => gamepad.index !== e.gamepad.index));
  };

  const animate = () => {
    // TODO: Make this more efficient
    const currGamepads = gamepadsRef.current;

    if (currGamepads[0] && !hasAutoGamepad()) {
      const gamePadsFromNavigator = navigator.getGamepads()?.filter((x) => x !== null) as Gamepad[];
      setGamepads((_) => gamePadsFromNavigator);
      const currentGamepad = gamePadsFromNavigator.find((x) => x?.id === currGamepads[0]?.id);

      if (currentGamepad) {
        // console.log(gamePadsFromNavigator.buttons.map((x) => x.pressed));
      }
    }

    // TODO: the gamepad buttons are not updated in the gamepad state
    if (currGamepads?.length !== 0) {
      // const debugVals = currGamepads[0].buttons.filter((x) => x.pressed).map((x) => x.value);
      // console.log(debugVals.join(','));

      const gamepad = currGamepads[0];
      for (let i = 0; i < 10; i++) {
        const button = document.querySelector(`.gamepadbutton.btn${i}`) as HTMLElement;
        const buttonPressed = gamepad.buttons[i - 1]?.pressed;
        if (buttonPressed) {
          button.classList.add('pressed');
        } else {
          button.classList.remove('pressed');
        }
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current as number);
  }, []);

  useEffect(() => {
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  return (
    <div className="App">
      <h3>Gamepad data</h3>
      <p>(Only supports one gamepad at a time)</p>
      <p>{gamepadData}</p>
      {/* TODO: Make as many divs as buttons_length */}
      <div className="gamepadbuttons">
        <div className="gamepadbutton btn0">0</div>
        <div className="gamepadbutton btn1">1</div>
        <div className="gamepadbutton btn2">2</div>
        <div className="gamepadbutton btn3">3</div>
        <div className="gamepadbutton btn4">4</div>
        <div className="gamepadbutton btn5">5</div>
        <div className="gamepadbutton btn6">6</div>
        <div className="gamepadbutton btn7">7</div>
        <div className="gamepadbutton btn8">8</div>
        <div className="gamepadbutton btn9">9</div>
      </div>
    </div>
  );
}

export default App;
