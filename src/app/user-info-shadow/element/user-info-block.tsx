import { useState, useEffect, useRef, useMemo, useCallback, createContext } from 'react';
import {
    ClaendarIcon,
    TelehoneMissedIcon,
    LifeBuoyIcon
} from '../../../icon'
import ButtonBar from './button-bar';
import React from 'react';
import { sendMessage } from "../../../chrome/utils";
import { ACTIONS } from "../../../chrome/actions-bg";
import EdauctionBlock from './education-services-block';
import EyesNumber from './eyes-number'
import { Modal, Button } from 'react-bootstrap';

function InfoBlock(params: any) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // console.log('InfoBlock')
    // const [START, setStart] = useState<any>(false)
    const [USER_INFO, setUserInfo] = useState<any>()
    const [ERROR, setError] = useState()
    const [RELATION, setRelation] = useState('')
    const effectStatus = useRef(true)
    const buttonCollapseRef = useRef<any>()
    const mapRelation: any = {
        'kid': 'Skysmart - KIDS',
    }

    const startChatAutofaq = (callback: any) => {
        if (params.session.data.roles.includes('ROLE_SUPPORT')) {
            const getParams = {
                userId: USER_INFO.data.id,
                operatorAfId: params.afUserId
            }
            sendMessage(ACTIONS.GET_AUTOFAQ_START_CHAT, getParams, (result: any) => {
                callback(result)
                // window.open(`https://crm2.skyeng.ru/persons/${USER_INFO.data.id}/customer-support/manual`)
            })
        }
    }

    const updateUserIngo = () => {
        effectStatus.current = true
        sendMessage(ACTIONS.GET_USER_ID, params.userId, (result: any) => {
            // console.log(result)
            console.log(effectStatus.current)
            const userInfo: any = result["user-info"]
            if (userInfo.data?.error || userInfo.data?.errors) {
                const errorMessage = userInfo.data.error?.message ? userInfo.error.message : userInfo.errors[0].message
                setError(errorMessage)
            } else if (userInfo.data && effectStatus.current) {
                console.log(effectStatus.current)
                const findRelation = result.family.data.find((element: any) => {
                    return element.general.id === userInfo.data.id
                })
                setRelation(findRelation.relation)
                setUserInfo(userInfo)
            }
            // else {
            //     setError(userInfo)
            // }
        })
    }

    useEffect(() => {
        // console.log('updateUserIngo')
        if (params.startValue && params.userId !== '') {
            updateUserIngo()
        } else {
            setError(undefined)
            setUserInfo(undefined)
        }
        return () => {
            effectStatus.current = false;
            console.log(effectStatus.current)
        }
    }, [params.userId, params.startValue])

    return (
        <>
            <ButtonBar user-info={USER_INFO} user-id={params.userId} startValue={params.startValue} />

            {USER_INFO === undefined ?
                ERROR === undefined
                    ? <></>
                    : <pre className="text-center text-wrap">
                        {JSON.stringify(ERROR)}
                    </pre>
                : <>
                    <div className="text-center position-relative">
                        <>
                            <div className="position-absolute top-0 start-0 btn-group">
                                {params.howUser === 'student' &&
                                    <div className='bg-none custom-icon me-1 rounded bg-secondary border border-b-dark '>
                                        <TelehoneMissedIcon />
                                    </div>
                                }
                                <div className='bg-none custom-icon autoFaq rounded bg-secondary border border-b-dark '
                                    onClick={handleShow}
                                >
                                </div>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton closeVariant="white" bsPrefix="modal-header bg-b-border fs-4">
                                        <Modal.Title bsPrefix="modal-titile text-light">Создание чата с {USER_INFO.data.id}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body bsPrefix="modal-body bg-dark text-light">
                                        Эта функция временно работает только для сотрудников ТП
                                    </Modal.Body>
                                    <Modal.Footer bsPrefix="modal-footer bg-dark">
                                        <Button variant="primary" onClick={() => {
                                            startChatAutofaq((result: any) => {
                                                window.open(`https://skyeng.autofaq.ai/tickets/assigned/${result["start-chat"].conversationId}`)
                                                handleClose()

                                            })
                                        }}>
                                            Открыть вкладку на чат
                                        </Button>
                                        <Button variant="primary" onClick={() => {
                                            startChatAutofaq((result: any) => {
                                                console.log('Чат запущен без вкладки')
                                                handleClose()
                                            })
                                        }}>
                                            Запустить чат без вкладки
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </>


                        <div className="position-absolute top-0 end-0 rounded border border-b-dark  bg-secondary">
                            <div className='bg-none custom-icon'
                                onClick={() => {
                                    window.open(`https://crm2.skyeng.ru/persons/${USER_INFO.data.id}/customer-support/manual`)
                                }}
                            >
                                <LifeBuoyIcon />
                            </div>
                        </div>

                        {/* <div className="position-absolute bottom-0 start-0 rounded border border-b-dark  bg-secondary">
                                    <div className='bg-none custom-icon autoFaq'
                                        onClick={() => {

                                        }}
                                    >
                                    </div>
                                </div> */}

                        <div className="position-absolute bottom-50 end-50"></div>
                        <div className="position-absolute bottom-0 start-0"></div>
                        <div className="position-absolute bottom-0 end-0"></div>

                        <div className="text-light text-center bg-exten-UI d-grid">
                            {RELATION === 'kid' &&
                                <>
                                    <span className="text-info fs-6 fw-bold">
                                        {mapRelation[RELATION]}
                                    </span>
                                </>
                            }
                            <span>
                                {`ID: ${USER_INFO.data.id}`}
                            </span>
                            {/* <br /> */}
                            <span>
                                {`Name: ${USER_INFO.data.name}`}
                            </span>
                            <span>
                                {`eMail: ${USER_INFO.data.email}`}
                            </span>
                            <span>
                                <EyesNumber userInfo={USER_INFO.data} />
                            </span>
                            <span>
                                {`Skype: ${USER_INFO.data.skype}`}
                            </span>
                            <span>
                                {`Identity: ${USER_INFO.data.identity}`}
                            </span>
                            <span>
                                {`Время: ${USER_INFO.data.utcOffset} UTC`}
                            </span>
                        </div>
                    </div>
                    {
                        params.startValue &&
                        <EdauctionBlock howUser="student" startValue={params.startValue} userInfo={USER_INFO.data} />
                    }
                </>
            }
        </>
    )
}

export default InfoBlock;