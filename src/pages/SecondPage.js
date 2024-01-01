import React, {useState, useRef, useEffect} from 'react'
import toast from "react-hot-toast";
import ACTIONS  from '../Actions';
import Client from '../components/Client';

import { initSocket } from '../socket';
import {useLocation, useNavigate, Navigate, useParams} from 'react-router-dom';
import Chat from '../components/Chatting/chat';

const SecondPage = () => {

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const {roomId} = useParams();

    const [clients, setClients] = useState([
    ]);

    const[theme, setTheme] = useState('light');
    
    
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    
    const toggle = () => {
        toggleTheme();
        
    }
    const themeRef = useRef(null); 

    useEffect(() => {
        document.body.className = `${theme}-theme`;
    }, [theme]);

    useEffect (() =>{

        const init = async() => {

            socketRef.current = await initSocket();
            socketRef.current.on('connect_error',(err) => handleErrors(err));
            socketRef.current.on('connect_failed',(err) => handleErrors(err));

            function handleErrors(e){
                console.log("socket error", e);
                toast.error("Socket connection failed, try again later");
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                username: location.state?.username,
                
            });

            socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId}) => {
                if(username !== location.state?.username) {
                    toast.success(`${username} has joined the room`);             
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {code: codeRef.current, socketId});
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) => {
                toast.success(`${username} has left the room`);

                setClients((prev) => {
                    return prev.filter(client => client.socketId !== socketId);
                })
            })
        };

        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    },[]);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('RoomId has been copied to clipboard');
        } catch(err) {

        }
    }


    function leaveRoom() {
        reactNavigator('/');
    }

    if(!location.state) {
        return <Navigate to="/"/>
    }

  return (
    <div>
    <header className="myheader"><h1>Goodspace</h1></header>
    <div className='mainWrap' >
        <div className="chatWrap"> 
                <Chat socketRef = {socketRef} roomId={roomId}/>
            </div> 
        <div className="aside">
            <div className="asideInner">
                
                 <h3 className="connect">Connected</h3>
                <div className="clientsList">

                    {
                        clients.map((client) => (
                        <Client key = {client.socketId} username = {client.username}/>
                        
                    ))}
                </div>
            </div>
            <div className='buttons'>
                
                <button className="Copybtn" onClick={copyRoomId}>Copy Roomid</button>
                <button className="Leavebtn" onClick={leaveRoom}>Leave Call</button>
            </div>
        </div>
           
                
                
    </div>
    </div>
  );
};


export default SecondPage
