import React from 'react';
import { useState, useEffect, useRef, useMemo, useCallback, createContext } from 'react';
import { getEducationInfo } from '../function/get-education-info'
import { sendMessage } from "../../../chrome/utils";
import { ACTIONS } from "../../../chrome/actions-bg";
import InfoBlock from './user-info-block';

interface HitLog {
    serviceTypeKey: string;
    shortTitle: string;
}

interface eduInfo {
    data?: {

        error?: {
            message?: string
        };
        errors?: object;
    };
    error?: {
        message?: string
    };
    errors?: any;
}

function EducationBlock(params: { userInfo: any; startValue: unknown; howUser: string; }) {
    // console.log('InfoBlock')
    const [START, setStart] = useState(true)
    const [EDUCATION, setEducation] = useState([])
    const [ERROR, setError] = useState<any>()
    const configurationsRef = useRef<any>({})

    const mapEducation = (educationValue: string) => {
        if (null !== configurationsRef.current) {
            const result = configurationsRef.current.filter((value: { serviceTypeKey: string; }, key: any) => {
                return value.serviceTypeKey === educationValue
            })
            return result[0].shortTitle
        }

    }

    const mapEducationColor = (educationValue: any) => {
        if (educationValue.incorrectnessReason !== null) {
            return 'fatal'
        }
        if (educationValue.stage === "regular_lessons") {
            return 'success'
        }
        if (educationValue.stage === "before_call") {
            return 'gold'
        }
        if (educationValue.stage === "lost") {
            return 'lost'
        }
        if (educationValue.stage === "after_trial" || educationValue.stage === "after_call") {
            return 'info'
        }
    }
    const updateEducation = async () => {
        sendMessage(ACTIONS.GET_EDUCATION_INFO, params.userInfo.id, (result: any) => {
            // const resData = result["education-service"]
            const educationInfo: any = result["education-service"]
            // educationInfo["data"] = result["education-service"]
            if (educationInfo.data?.length === 0 || educationInfo?.data?.error || educationInfo.data?.errors) {
                if (educationInfo.data?.error) {
                    const errorMessage = educationInfo.data?.error?.message ? educationInfo?.error.message : educationInfo?.errors[0].message
                    setError(errorMessage)
                }
            } else if (educationInfo.data) {
                console.log(result)
                const resultConfog: any = result["configurations"].data
                configurationsRef.current = resultConfog
                setEducation(educationInfo.data)

            } else {
                setError(educationInfo)
            }
        })
    }

    useEffect(() => {
        // console.log('updateUserIngo')
        if (params.userInfo.type === 'student') {
            updateEducation()
        } else {
            setError(undefined)
            setEducation([])
        }
    }, [JSON.stringify(params.userInfo), params.startValue])

    return (
        EDUCATION.length === 0 ?
            ERROR === undefined
                ? <></>
                : <pre className="text-center">
                    {JSON.stringify(ERROR)}
                </pre>
            : <>
                <div className="accordion" id="accordionExample">
                    {
                        EDUCATION.map((educationValue: any, key: number) => {
                            const teacherId = educationValue.teacher?.general?.id !== undefined
                                ? educationValue?.teacher.general.id
                                : ''
                            return (
                                <div className="accordion-item" key={key}>
                                    <div className="accordion-header" id="panelsStayOpen-headingTwo">
                                        <button className={`accordion-button collapsed padding-btn-0 fs-custom-0_7 bg-${mapEducationColor(educationValue)} text-light`} type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapseUserInfo-${key}`}
                                            aria-expanded="false"
                                            aria-controls={`collapseUserInfo-${key}`}
                                        >
                                            <div className="ms-1  w-75">
                                                <div className=" btn-group">
                                                    <div className="w-180px me-2">
                                                        <span>{`Плательщик: ${educationValue.paymentAgreement.person.general.id}`}</span>
                                                        <br/>
                                                        У: {educationValue.student.general.name}
                                                        {/* <div className='input-group'>
                                                            <div className='coin custom-icon w-15px h-15px'>
                                                            </div>
                                                            <span className='ms-1 text-nowrap'>
                                                            : {educationValue.balance}
                                                            </span>
                                                        </div> */}
                                                        <br/>
                                                        <div className=" text-nowrap inline">{mapEducation(educationValue.serviceTypeKey)}</div>

                                                    </div>



                                                    <div className={`w-65px fs-custom-0_7 d-grid bg-${mapEducationColor(educationValue)}`}>
                                                        <div className='btn-group'>
                                                            {/* <span>{`П: `}</span> */}
                                                            <span>{educationValue.teacher !== null ? 'П: '+educationValue.teacher.general.id : 'П: -'}
                                                            </span>
                                                        </div>
                                                        <div className='btn-group'>
                                                            <div className='coin custom-icon w-15px h-15px'>
                                                            </div>
                                                            <span className='ms-1 text-nowrap'>
                                                                : 1
                                                                {/* {educationValue.balance} */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    <div id={`collapseUserInfo-${key}`} className={`accordion-collapse collapse`}
                                        aria-labelledby="panelsStayOpen-headingTwo"

                                    >

                                        {educationValue.teacher !== null ?
                                            <div className="bg-dark">
                                                {/* <ButtonBar howUser="teacher" /> */}
                                                <InfoBlock howUser="teacher" startValue={START} userId={teacherId} />
                                            </div>
                                            : <div className="bg-dark text-light text-center">Не указан преподаватель</div>
                                        }


                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </>
    )
}

export default EducationBlock;