import React from 'react';
import { useEffect, useRef, useCallback, useMemo, useState, StrictMode } from 'react';


const AnswerOperator = (params: any) => {
    const findOperatorName = ()=>{
        const result = params.operatorName.find((value: any)=>{
            return value.id === params.text.operatorId
        })
        return result
    }
    const operatorName = findOperatorName()
    return (
        <div className="chat-message chat-answer chat-answer-from_operator">
            <div className="chat-message-block chat-message-block--html">
                <div className="chat-message-header">
                    <div className="chat-message-sender">{operatorName.name}:</div>
                    <div className="chat-message-time chat-message-time-answer">{params.dateTime.dateTime}</div>
                    <div className="chat-message-icons active"></div>
                </div> 
                <span className="text-light" dangerouslySetInnerHTML={{__html: params.text.txt}}>
                </span>
            </div>
        </div>
    )
}

export default AnswerOperator