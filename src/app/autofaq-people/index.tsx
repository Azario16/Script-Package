import React from 'react'
import Colapse from 'bootstrap/js/dist/collapse.js';
import ReactDOM from 'react-dom/client';
import { sendMessage } from "../../chrome/utils";
import { ACTIONS } from "../../chrome/actions-bg";

import UserStatus from './element/user-statuc-block'

interface ClassValue {
    status: string,
    color: string,
}

function innerTextElement(node: HTMLElement): string {
    return node.innerText; // Property 'innerText' does not exist on 'T'
}
// async function StatusAutofaqPeopleRender() {
class Reservation extends React.Component<{}, {
    // userGroup: string,
    //userGroup: 'ТП',
    // userName: string,
    //userName: 'ТП-Гусейнов Рахид',
    userKbs: any,
    userId: any,
    error: any,
    data: any,
    isLoadedData: boolean,
    isLoaded: boolean,
    operStatus: any,
    ArrPeople: any,
    groupCnt: 0,
    class: Array<ClassValue>,
}> {
    constructor(props: any) {
        // sendMessage(ACTIONS.GET_AUTOFAQ_OPERATOR_INFO, '', (result: any) => {
        //     console.log(result)
        //     userGroup = result.settings.knowledgeBases;
        //     userName = '';
        //     userId = result.id;
        // })

        // const userGroupElem: HTMLElement = document.querySelector('.user_menu-dropdown-user_name')!
        // const userNameElem: HTMLElement = document.querySelector('.user_menu-dropdown-user_name')!

        // userGroup = innerTextElement(userGroupElem).split('-')[0];;
        // userName = innerTextElement(userNameElem);


        super(props);
        this.state = {
            // userGroup: userGroup,
            // userGroup: 'ТП',
            // userGroup: '',
            // userName: userName,
            // userName: 'ТП-Гусейнов Рахид',
            // userName: '',
            userKbs: [],
            userId: null,
            error: null,
            data: [],
            isLoadedData: false,
            isLoaded: false,
            operStatus: [],
            ArrPeople: [],
            groupCnt: 0,
            class: [
                {
                    status: 'Online',
                    color: 'bg-success'
                },
                {
                    status: 'Busy',
                    color: 'bg-warning'
                },
                {
                    status: 'Pause',
                    color: 'bg-danger'
                }
            ],
        };
        // }

    }

    openModalElenet(this: any, operatorId: string) {
        const messageValue = {
            message: 'open-operator-chat',
            operatorAfId: operatorId
        }

        sendMessage(ACTIONS.SEND_EVENT, messageValue, (result: any) => {

        })
    }

    componentDidMount() {
        //console.log("componentDidUpdate")
        sendMessage(ACTIONS.GET_AUTOFAQ_OPERATOR_INFO, '', (result: any) => {
            console.log(result)
            this.setState({
                userKbs: result.settings.knowledgeBases,
                userId: result.id,
            })
        })
        this.getCurrentState()
        // setTimeout(this.getCurrentState.bind(this), 3000)
        setInterval(this.getCurrentState.bind(this), 15000)
    }


    async getCurrentState() {
        // console.log("getCurrentState")
        sendMessage(ACTIONS.GET_AUTOFAQ_PEOPLE, '', (result: any) => {
            const operState = result['people-list']
            // console.log(operState)
            // console.log(this.state)
            // console.log(this.state.groupCnt)
            const operStatus = this.parseStatus(operState)
            // console.log(operStatus)
            let operStatusRender = Object.assign({}, operStatus.Online, operStatus.Busy, operStatus.Pause);
            let cCntUndistributedGroup = this.checkSumContTematicGroup(operState)
            this.setState({
                isLoaded: true,
                data: operState,
                operStatus: operStatus,
                groupCnt: cCntUndistributedGroup,
                ArrPeople: operStatusRender
            })
            // console.log(this.state)
        })
    }
    parseStatus(data: any) {
        //console.log('parseStatus')
        const online = this.parse('Online', data);
        const busy = this.parse('Busy', data);
        const pause = this.parse('Pause', data);

        const parseResult = {
            Online: online,
            Busy: busy,
            Pause: pause
        }
        return parseResult
    }

    ckechKbOperator(knowledgeBases: any){
        return true
    }

    parse(status: any, data: any) {
        //console.log('parse')
        //console.log(status, groupIdParse)
        const userList: any = []
        const userKB: any = []
        let userInfo = {};
        // статус операторов на английском, решил в массиве сразу интерпретировать а не в момент когда буду делать строку для отправки
        // используется для бота, здесь просто оставлю возможно пригодится
        data.forEach((person: any, index: any) => {
            // AF вместо 0 чатов отдает null, тут условие чтобы были нули
            if (person.operator !== null) {
                // Ищем совпадения по имени того кто зашел в систему и присваиваем тематику в state
                // if (person.operator.fullName === this.state.userName) {
                //     this.setState({ userKbs: person.operator.kbs })
                //     userKB.push(person.operator.kbs)
                //     // console.log(this.state)
                //     // console.log(person.operator.kbs)
                // }

                if (person.operator.status === status && this.ckechKbOperator(person.operator.kbs)) {
                    if (person.aCnt === null) {
                        data[index].aCnt = 0;
                    }
                    if (person.cCnt === null) {
                        data[index].cCnt = 0;
                    }
                    userInfo = {
                        name: person.operator.fullName,
                        id: person.operator.id,
                        stats: status,
                        aCnt: data[index].aCnt,
                        cCnt: data[index].cCnt,
                        sCnt: data[index].aCnt + data[index].cCnt,
                    }
                    userList.push(userInfo);
                }
            }
        });
        return userList;
    }
    colorUndistributed() {
        if (this.state.groupCnt < 5) {
            return "bg-success"
        } else {
            return "bg-danger"
        }
    }
    checkSumContTematicGroup(operState: any) {
        //console.log('checkSumContTematicGroup')
        const listCntUndistributed: any = [];
        const userKb = operState.find((person: any) => {
            return person.operator.fullName === this.state.userId
        })
        operState.forEach((operatorState: any) => {
            if (operatorState.operator === null) {
                if (userKb.operator.kbs.includes(operatorState.kb)) {
                    listCntUndistributed.push(operatorState.cCnt)
                }
            }
        });
        const summCnt = listCntUndistributed.reduce((sum: any, current: any) => sum + current, 0);
        return summCnt;
    }
    render() {
        // console.log('Render')
        // console.log(this.state.userKbs)
        const { error, isLoaded } = this.state;
        if (error) {
            return <div>Ошибка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Загрузка...</div>;
        } else {
            return (
                <div className="ant-menu app-content ant-menu-dark ant-menu-root ant-menu-inline">
                    <li className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-active" role="PeopleList">
                        <div>
                            <div className="ant-menu-item ant-menu-item-only-child">
                                <div className={this.colorUndistributed() + " asign-slot-box fs-el-0_7 badge rounded-pill col-auto row g-0 badge border border-3 border-border-green"}>{this.state.groupCnt}</div>
                                <span className="">
                                    <span className="ant-badge user-select-none  mx-1">Нераспред</span>
                                </span>
                            </div>
                            <div className="ant-menu-item ant-menu-item-only-child " data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                <span className="ps-4 user-select-none "> Список </span>
                            </div>
                            <div className="collapse show" id="collapseExample">
                                <div className="card card-body ant-menu-dark ant-menu ant-menu-sub ant-menu-inline">
                                    <div className="">
                                        {
                                            this.state.operStatus.Online.map((body: any, number: any) => {
                                                const status = this.state.class.find((value: ClassValue) => {
                                                    return value.status === body.stats
                                                })
                                                return (
                                                    <UserStatus body={body} status={status} searchChat={this.openModalElenet.bind(this, body.id)} key={body.name} />
                                                )
                                            })
                                        }

                                        {
                                            this.state.operStatus.Busy.map((body: any) => {
                                                const status = this.state.class.find((value: ClassValue) => {
                                                    return value.status === body.stats
                                                })
                                                return (
                                                    <UserStatus body={body} status={status} searchChat={this.openModalElenet.bind(this, body.id)} key={body.name} />
                                                )
                                            })
                                        }
                                        {
                                            this.state.operStatus.Pause.map((body: any, number: any) => {
                                                const status = this.state.class.find((value: ClassValue) => {
                                                    return value.status === body.stats
                                                })
                                                return (
                                                    <UserStatus body={body} status={status} searchChat={this.openModalElenet.bind(this, body.id)} key={body.name} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div >
                    </li>
                </div>
            )

        }
    }
}
// const root = ReactDOM.createRoot(
//     document.querySelector('#people_head') as HTMLElement
// );

// root.render(
//     <Reservation />
// );
// ReactDom.render(
//     <Reservation />, document.querySelector('#people_head'),
// );
// }
export default Reservation;