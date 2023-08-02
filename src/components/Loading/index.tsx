import MoonLoader from 'react-spinners/MoonLoader';
import './style.css';
import { CSSProperties } from 'react';

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

const Loading = () => {
    return (
        <div id='loading-screen' className='loadscreen'>
            <MoonLoader
                color={"#ffffff"}
                loading={true}
                cssOverride={override}
                size={75}
                speedMultiplier={0.8}
                aria-label="Loading Spinner"
                data-testid="loader"
            />

            <h1>Carregando</h1>
        </div>
    )
}

export default Loading;