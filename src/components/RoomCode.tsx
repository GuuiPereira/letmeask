import copyImg from '../assets/images/copy.svg';
import toast from 'react-hot-toast';
import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string
}

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipBoard() {
    navigator.clipboard.writeText(props.code);
    toast.success('Copiado!', { duration: 3000 })
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipBoard}>
      <div>
        <img src={copyImg} alt="Copy room code"></img>
      </div>
      <span> Sala #{props.code}</span>
    </button>
  )
}