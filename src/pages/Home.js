import React, {useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaGoodreadsG } from "react-icons/fa";

import logo from '../assets/logo.png';

const Home = () => {

    const navigate = useNavigate();
  
    const [roomId, setRoomId] = useState('');
    const [username, setUserName] = useState('');  
    const createNewRoom = (e) =>{
      e.preventDefault();
  
      const id = uuidv4();
  
      setRoomId(id);
  
      toast.success('Created a new Room Id');
      
    };
  
    const joinRoom = () =>{
      if(!roomId || !username){
        toast.error("RoomId and username are required you loser");
      }
      else{
      navigate(`/editor/${roomId}`,{
        state: {
          username,
          
        }
      })
  
      }
    }
  

    const handleInputEnter = (e) => {
        if(e.code === 'Enter') {
            joinRoom();
        }
    }
    return (
      <div>
        <header className="myheader"><h1>Goodspace</h1></header>
        <div className="HomePageWrapper">
          
            
            <div className="formWrapper">
                <h4 className="mainLabel">Sign Up/Login</h4>
                <div className="inputGroup">
                    <input type="text" className="inputBox" onChange={(e) => setUserName(e.target.value)} value={username} placeholder='Write your Email Here'></input>

                    <input type="text" className="inputBox" onChange={(e) => setRoomId(e.target.value)} value={roomId} onKeyUp={handleInputEnter}
                    placeholder='Wrtie password here'></input>

                    <button className="ButtOn" onClick={joinRoom}>Is it hard yet?</button>

                    <span className="createInfo">If you do not have a ChatID  you can create your own,
                    Or get a random one using  <a onClick={createNewRoom} href="" className="createNewBtn">Create ChatID</a></span>

                </div>
            </div>

           
            
            <footer>
                <h4>Built for goodspace with luv</h4>
            </footer>
        </div>
        </div>
    );
};

export default Home
