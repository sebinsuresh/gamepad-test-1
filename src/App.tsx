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

function App() {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);
  const gamepadsRef = useRef<Gamepad[]>([]);
  const [gamepadData, setGamepadData] = useState('Press a button on your gamepad');
  const animationRef = useRef<number>();

  useEffect(() => {
    console.log('set gamepad data useeffect ran');
    if (gamepads.length === 0) {
      setGamepadData('Press a button on your gamepad after connecting');
      return;
    }

    setGamepadData(JSON.stringify(gamepads.map(getGamepadData)));
  }, [gamepads]);

  // Whenever gamepads changes, update the ref
  useEffect(() => {
    console.log('gamepad ref update ref ran');
    gamepadsRef.current = gamepads;
  }, [gamepads]);

  const handleGamepadConnected = (e: GamepadEvent): void => {
    setGamepads((gps) => [...gps, e.gamepad]);
  };

  const handleGamepadDisconnected = (e: GamepadEvent): void => {
    setGamepads((gps) => gps.filter((gamepad) => gamepad.index !== e.gamepad.index));
  };

  const animate = () => {
    // setGamepads((gamepads) =>
    //   navigator.getGamepads && navigator.getGamepads().filter((x) => x !== null).length > 0
    //     ? (navigator.getGamepads() as Gamepad[]) ?? gamepads
    //     : gamepads
    // );
    // const currGamepads = gamepads;

    const currGamepads = gamepadsRef.current;

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
    console.log('requestanimationframe setup useeffect ran');
    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current as number);
  }, []);

  useEffect(() => {
    console.log('gamepad connect event listeners useeffect ran');
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  return (
    <div className="App">
      <header>Gamepad data</header>
      <p>{gamepadData}</p>
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
  );
}

export default App;
