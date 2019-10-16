import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import {Socket, Channel } from "phoenix";

const SOCKET_URL = "/socket";
const TIMEOUT_DURATION = 5000

const CHANNEL_JOIN_OK = "Channel %s: Joined channel";
const CHANNEL_JOIN_ERROR = "Channel %s: Failed to join";
const CHANNEL_JOIN_TIMEOUT = "Channel %s: Timeout";
const NO_CHANNEL = "Not connected to any channel";

interface RoomProps {
    roomId: string,
}

enum ChannelResponse {
    OK = "ok",
    ERROR = "error",
    TIMEOUT = "timeout",
}

enum GameType {
    ShakeMeUp = 0,
}

enum EventType {
    GameFinished = "gameFinishedEvent",
}

abstract class SocketMessage {
    abstract type: EventType;
    abstract payload: object;
}

class GameFinishedMessage extends SocketMessage {
    type: EventType = EventType.GameFinished;
    payload: number[];

    constructor(results: number[]) {
        super();
        this.type = EventType.GameFinished;
        this.payload = results
    }
} 

export const Room:FunctionComponent<RoomProps> = ({roomId}) => {

    const [channel, setChannel] = useState<null | Channel>(null);
    const channelRef = useRef(channel)
    const [game, setGame] = useState<null | GameType>(null);
    const gameType = useRef(game);

    /**** METHODS ****/
    const initConnection = ():void => {
        const socket = new Socket(SOCKET_URL, {params: {}})
        socket.connect()

        let channel = socket.channel("room:".concat(roomId))
        channel.join(TIMEOUT_DURATION)
            .receive(ChannelResponse.OK, handleConnect)
            .receive(ChannelResponse.ERROR, ({reason}) => console.log(CHANNEL_JOIN_ERROR, reason))
            .receive(ChannelResponse.TIMEOUT, () => console.log(CHANNEL_JOIN_TIMEOUT));
        
        setChannel(channel)
    }

    const sendMessage = (socketMessage:SocketMessage):void => {
        if (!channelRef || !channelRef.current) {
            throw new Error(NO_CHANNEL);
        }

        channelRef.current.push(socketMessage.type, socketMessage.payload, TIMEOUT_DURATION);
    }

    /**** HANDLERS ****/
    const handleConnect = (messages:any) => {
        console.log(CHANNEL_JOIN_OK, messages)

        if (!messages.gameID) return new Error();
        
        setGame(messages.gameID);
    }

    
    /**** CALLBACKS ****/
    const submitResults = (results:number[]):void => {
        const message:SocketMessage = new GameFinishedMessage(results);
        sendMessage(message);
    }

    useEffect(initConnection,[roomId])

    return <div>
        {/* hot swap game */}
        {/* <ShakeMeUp submit={submitResults} /> */}
    </div>
}
