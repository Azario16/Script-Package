import { api } from '../../service/api-url';

const testingGet = async (body: any) => {
    const urlApi = `${api()}`;

    let get = await fetch(urlApi, {
        method: "POST",
        body: JSON.stringify(body),
        // credentials: "include"
    })
    if (body?.return === 'doc') {
        const result = await get.text();
        return result
    }
    const result = await get.json();
    return result
}

const productGet = async (url: string, methodOption: any) => {
    let get: any = await fetch(url, methodOption)
    return get
}



const GetterBackground = () => {
    return {
        getSession: async (userId: any, callback: any) => {
            const arrayResult: any = {
                'session': {},
            }

            const urlSession = `https://backend.skyeng.ru/api/session`;
            if (window.location.hostname === 'extension-test.ru') {
                let bodySession: any = {}
                bodySession['uer-get'] = urlSession;
                const resultSession = await testingGet(bodySession)
                arrayResult['session'] = resultSession
            } else {
                const resultSession = await productGet(urlSession, {
                    method: "GET",
                    credentials: "include"
                })
                arrayResult['session'] = await resultSession.json()
            }
            callback(arrayResult)
            return arrayResult
        },
        getEducationInfo: async (userId: any, callback: any) => {
            const arrayResult: any = {
                'education-service': {},
                'configurations': {}
            }

            const urlEducation = `https://backend.skyeng.ru/api/persons/${userId}/education-services/`;

            // if (window.location.hostname === 'extension-test.ru' || window.location.hostname === 'gibeoebkgmgoeoemcbofgdfcmllkdjpe') {
            if (window.location.hostname === 'extension-test.ru') {
                // console.log('DEV')
                let bodyEducation: any = {}
                bodyEducation['uer-get'] = urlEducation;
                const resultEducation = await testingGet(bodyEducation)
                arrayResult['education-service'] = resultEducation
            } else {
                // console.log('PROD')
                const resultEducation = await productGet(urlEducation, {
                    method: "GET",
                    credentials: "include"
                })
                arrayResult['education-service'] = await resultEducation.json()
                console.log(arrayResult['education-service'])
            }

            const urlConfigurations = `https://backend.skyeng.ru/api/products/configurations/`;
            // if (window.location.hostname === 'extension-test.ru' || window.location.hostname === 'gibeoebkgmgoeoemcbofgdfcmllkdjpe') {
            if (window.location.hostname === 'extension-test.ru') {
                // console.log('DEV')
                let bodyConfigurations: any = {}
                bodyConfigurations['uer-get'] = urlConfigurations;
                const resultConfigurations = await testingGet(bodyConfigurations)
                arrayResult['configurations'] = resultConfigurations
            } else {
                // console.log('PROD')
                const resultConfigurations = await productGet(urlConfigurations, {
                    method: "GET",
                    credentials: "include"
                })
                arrayResult['configurations'] = await resultConfigurations.json()
                console.log(arrayResult['configurations'])
            }

            callback(arrayResult)
            return arrayResult

        },
        getTeacherTrmId: async (userId: any, callback: any) => {
            const arrayResult: any = {
                'teacher-id': {},
            }

            const urlTeacherTrmId = `https://tramway.skyeng.ru/teacher/autocomplete/search?stage=all&term=${userId}`;
            if (window.location.hostname === 'extension-test.ru') {
                let bodyTrmIdList: any = {}
                bodyTrmIdList['uer-get'] = urlTeacherTrmId;
                const resultTrmId = await testingGet(bodyTrmIdList)
                arrayResult['teacher-id'] = resultTrmId
            } else {
                const resultTrmId = await productGet(urlTeacherTrmId, {
                    method: "GET",
                    credentials: "include"
                })
                arrayResult['teacher-id'] = await resultTrmId.json()
            }
            callback(arrayResult)
            return arrayResult

        },
        getUserInfo: async (userId: any, callback: any) => {
            const arrayResult: any = {
                'user-info': {},
                'family': {},
            }

            const urlUserInfo = `https://backend.skyeng.ru/api/persons/${userId}`;
            if (window.location.hostname === 'extension-test.ru') {
                let bodyUserInfoList: any = {}
                bodyUserInfoList['uer-get'] = urlUserInfo;
                const resultUserInfo = await testingGet(bodyUserInfoList);
                arrayResult['user-info'] = resultUserInfo
            } else {
                const resultUserInfo = await productGet(urlUserInfo, {
                    method: "GET",
                    credentials: "include"
                });
                arrayResult['user-info'] = await resultUserInfo.json()
            }

            const urlFamily = `https://backend.skyeng.ru/api/persons/${userId}/family/`
            if (window.location.hostname === 'extension-test.ru') {
                let bodyFamily: any = {}
                bodyFamily['uer-get'] = urlFamily;
                const resultFamily = await testingGet(bodyFamily);
                arrayResult['family'] = resultFamily
            } else {
                const resultFamily = await productGet(urlFamily, {
                    method: "GET",
                    credentials: "include"
                });
                arrayResult['family'] = await resultFamily.json()
            }
            callback(arrayResult)
            return arrayResult
        },
        getUserNumber: async (userId: any, callback: any) => {
            const arrayResult: any = {
                'user-number': {},
            }
            const urlUserNumber = `https://backend.skyeng.ru/api/persons/${userId}/personal-data/?pdType=phone&source=persons.profile`;
            if (window.location.hostname === 'extension-test.ru') {
                let bodyUserNumber: any = {}
                bodyUserNumber['uer-get'] = urlUserNumber
                const resultUserNumber = await testingGet(bodyUserNumber)
                arrayResult['user-number'] = resultUserNumber
            } else {
                const resultUserNumber = await productGet(urlUserNumber, {
                    method: "GET",
                    credentials: "include"
                })
                arrayResult['user-number'] = await resultUserNumber.json()
            }
            callback(arrayResult)
            return arrayResult
        },
        getLoginLink: async (userId: any, callback: any) => {
            const arrayResult: any = {
                'doc': '',
                'loginLink': '',
                'success': true
            }
            const urlLoginLinkPost = `https://id.skyeng.ru/admin/auth/login-links`
            let bodyLoginLinkPost: any = {}
            bodyLoginLinkPost['uer-get'] = urlLoginLinkPost;
            bodyLoginLinkPost['body'] = `login_link_form%5Bid%5D=${userId}`;
            bodyLoginLinkPost['body'] += '&login_link_form%5Btarget%5D=https%3A%2F%2Fskyeng.ru'
            bodyLoginLinkPost['body'] += '&login_link_form%5Blifetime%5D=2000'
            bodyLoginLinkPost['method'] = 'POST'
            bodyLoginLinkPost['return'] = 'html'
            bodyLoginLinkPost['headers'] = {
                'content-type': 'application/x-www-form-urlencoded'
            }
            if (window.location.hostname === 'extension-test.ru') {
                await testingGet(bodyLoginLinkPost)
                // arrayResult['doc'] = resultLoginLinkPost


                let bodyLoginLink: any = {}
                bodyLoginLink['uer-get'] = urlLoginLinkPost
                bodyLoginLink['return'] = 'doc';
                const resultTrmId = await testingGet(bodyLoginLink)
                arrayResult['doc'] = resultTrmId
            } else {
                const resultLoginLinkPost = await productGet(urlLoginLinkPost, {
                    headers: bodyLoginLinkPost['headers'],
                    body: bodyLoginLinkPost['body'],
                    referrer: "https://id.skyeng.ru/admin/auth/login-links",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    method: "POST",
                    credentials: "include"
                })
                arrayResult['doc'] = await resultLoginLinkPost.text()
                console.log(arrayResult['doc'])
            }

            let json = {
                'loginLink': '',
                'success': true
            }
            try {
                const textHtml = arrayResult['doc'];
                let domPars = new DOMParser()
                let loginLinks: any = domPars.parseFromString(textHtml, `text/html`).querySelectorAll("[value^='https://id.skyeng.ru/auth/login-link/']")
                let last = loginLinks[loginLinks.length - 1].value;
                console.log(`Loginner: ${last}`)
                json.loginLink = last
                json.success = true
                console.log(json)
            } catch (err) {
                json.success = false
            }
            callback(json)
            return arrayResult
        },
        getLoginLinkOld: async (userId: any, callback: any) => {
            const arrayResult = {
                'login-link': {},
            }
            let bodyLoginLinkPost: any = {}
            bodyLoginLinkPost['uer-get'] = `https://id.skyeng.ru/admin/auth/login-links`;
            bodyLoginLinkPost['body'] = `login_link_form%5Bid%5D=${userId}`;
            bodyLoginLinkPost['body'] += '&login_link_form%5Btarget%5D=https%3A%2F%2Fskyeng.ru'
            bodyLoginLinkPost['body'] += '&login_link_form%5Blifetime%5D=2000'
            bodyLoginLinkPost['method'] = 'POST'
            bodyLoginLinkPost['return'] = 'html'
            bodyLoginLinkPost['headers'] = {
                'content-type': 'application/x-www-form-urlencoded'
            }

            // arrayList['userid'] = userId;
            const urlLoginLinkPost = `${api()}`;
            let getLoginLinkPost = await fetch(urlLoginLinkPost, {
                method: "POST",
                body: JSON.stringify(bodyLoginLinkPost),
                // credentials: "include"
            })
            const resultLoginLinkPost = await getLoginLinkPost.json();

            let json = {
                'loginLink': '',
                'success': true
            }

            let bodyLoginLink: any = {}
            bodyLoginLink['uer-get'] = `https://id.skyeng.ru/admin/auth/login-links`;
            bodyLoginLink['return'] = 'doc';

            // arrayList['userid'] = userId;
            const urlLoginLink = `${api()}`;
            let getLoginLink = await fetch(urlLoginLink, {
                method: "POST",
                body: JSON.stringify(bodyLoginLink),
                // credentials: "include"
            })

            try {
                const textHtml = await getLoginLink.text();
                let domPars = new DOMParser()
                let loginLinks: any = domPars.parseFromString(textHtml, `text/html`).querySelectorAll("[value^='https://id.skyeng.ru/auth/login-link/']")
                let last = loginLinks[loginLinks.length - 1].value;
                console.log(`Loginner: ${last}`)
                json.loginLink = last
                json.success = true
                console.log(json)
            } catch (err) {
                json.success = false
            }
            callback(json)
            return arrayResult
        },
        getAutofaqCurretnList: async (userId: string, callback: any) => {
            const arrayResult: any = {
                'people-list': {},
            }

            const urlCurrentList = `https://skyeng.autofaq.ai/api/operators/statistic/currentState`;
            if (window.location.hostname === 'extension-test.ru') {
                let bodyCurrentList: any = {}
                bodyCurrentList['uer-get'] = urlCurrentList;
                const resultCurrentList = await testingGet(bodyCurrentList);
                arrayResult['people-list'] = resultCurrentList.rows
            } else {
                const resultCurrentList = await productGet(urlCurrentList, {
                    method: "GET",
                    credentials: "include"
                })
                const currentList = await resultCurrentList.json()
                arrayResult['people-list'] = currentList.rows
            }
            callback(arrayResult)
            return arrayResult
        },
        getAutofaqPeopleList: async (userId: string, callback: any) => {
            const arrayResult: any = {
                'people-list': {},
            }

            const urlPeopleList = `https://skyeng.autofaq.ai/api/users?serviceId=361c681b-340a-4e47-9342-c7309e27e7b5&action=Reason8Operator`;
            if (window.location.hostname === 'extension-test.ru') {
                let bodyPeopleList: any = {}
                bodyPeopleList['uer-get'] = urlPeopleList;
                const resultPeopleList = await testingGet(bodyPeopleList);
                arrayResult['people-list'] = resultPeopleList.items
            } else {
                const resultPeopleList = await productGet(urlPeopleList, {
                    method: "GET",
                    credentials: "include"
                })
                const peopleList = await resultPeopleList.json()
                arrayResult['people-list'] = peopleList.items
            }
            callback(arrayResult)
            return arrayResult
        },
        getAutofaqEventList: async (userId: string, callback: any) => {
            const arrayResult: any = {
                'event-list': {},
            }
            const urlEventList = `https://skyeng.autofaq.ai/i18n/ru-RU/ticket.json`;
            if (window.location.hostname === 'extension-test.ru') {
                let bodyEventList: any = {}
                bodyEventList['uer-get'] = urlEventList;
                const resultEventList = await testingGet(bodyEventList);
                arrayResult['event-list'] = resultEventList.chatEvents
            } else {
                const resultEventList = await productGet(urlEventList, {
                    method: "GET",
                    credentials: "include"
                })
                const eventList = await resultEventList.json()
                arrayResult['event-list'] = eventList.chatEvents
            }
            callback(arrayResult)
            return arrayResult
        },
        getAutofaqChatListUser: async (data: any, callback: any) => {
            const arrayResult: any = {
                'chat-list': {},
            }
            const urlChatListUser = `https://skyeng.autofaq.ai/api/conversations/history`;

            let bodyChatListUser: any = {}
            bodyChatListUser['uer-get'] = urlChatListUser;
            bodyChatListUser['body'] = `{\"serviceId\":\"361c681b-340a-4e47-9342-c7309e27e7b5\",\"mode\":\"Json\",\"channelUserFullTextLike\":\"${data.USER_ID}\",\"tsFrom\":\"${data.START.current}T00:00:00.000Z\",\"tsTo\":\"${data.END.current}T23:59:59.059Z\",\"orderBy\":\"ts\",\"orderDirection\":\"Desc\",\"page\":1,\"limit\":10}`;
            bodyChatListUser['method'] = 'POST'
            bodyChatListUser['headers'] = {
                'content-type': 'application/json'
            }
            bodyChatListUser['return'] = 'json'


            if (window.location.hostname === 'extension-test.ru') {
                const resultChatListUser = await testingGet(bodyChatListUser);
                arrayResult['chat-list'] = resultChatListUser
            } else {
                const resultChatListUser = await productGet(urlChatListUser, {
                    headers: bodyChatListUser['headers'],
                    body: bodyChatListUser['body'],
                    method: "POST",
                    credentials: "include"
                })
                arrayResult['chat-list'] = await resultChatListUser.json()
            }
            callback(arrayResult)
            return arrayResult
        },
        getAutofaqChatListOperator: async (data: any, callback: any) => {
            const arrayResult: any = {
                'chat-list': {},
            }
            const urlChatListOperator = `https://skyeng.autofaq.ai/api/conversations/history`;
            const bodyOperator = {
                "serviceId": "361c681b-340a-4e47-9342-c7309e27e7b5",
                "mode": "Json",
                "participatingOperatorsIds": [
                    data.OPERATOR_ID.id
                ],
                "tsFrom": `${data.START.current}T23:23:00.043Z`,
                "tsTo": `${data.END.current}T23:23:00.043Z`,
                "usedStatuses": [
                    "OnOperator",
                    "AssignedToOperator",
                    "Active"
                ],
                "orderBy": "ts",
                "orderDirection": "Asc",
                "page": 1,
                "limit": 10
            }

            let bodyChatListOperator: any = {}
            bodyChatListOperator['uer-get'] = urlChatListOperator;
            // bodyChatListOperator['body'] = `{\"serviceId\":\"361c681b-340a-4e47-9342-c7309e27e7b5\",\"mode\":\"Json\",\"channelUserFullTextLike\":\"${data.USER_ID}\",\"tsFrom\":\"${data.START.current}T00:00:00.000Z\",\"tsTo\":\"${data.END.current}T23:59:59.059Z\",\"orderBy\":\"ts\",\"orderDirection\":\"Desc\",\"page\":1,\"limit\":10}`;
            bodyChatListOperator['body'] = JSON.stringify(bodyOperator)
            bodyChatListOperator['method'] = 'POST'
            bodyChatListOperator['headers'] = {
                'content-type': 'application/json'
            }
            bodyChatListOperator['return'] = 'json'


            if (window.location.hostname === 'extension-test.ru') {
                const resultChatListOperator = await testingGet(bodyChatListOperator);
                arrayResult['chat-list'] = resultChatListOperator
            } else {
                const resultChatListOperator = await productGet(urlChatListOperator, {
                    headers: bodyChatListOperator['headers'],
                    body: JSON.stringify(bodyOperator),
                    method: "POST",
                    credentials: "include"
                })
                arrayResult['chat-list'] = await resultChatListOperator.json()
            }
            callback(arrayResult)
            return arrayResult
        },
        getAutofaqMessageValue: async (chatId: string, callback: any) => {
            const arrayResult: any = {
                'message-value': {},
            }

            const urlMessageValue = `https://skyeng.autofaq.ai/api/conversations/${chatId}`;
            if (window.location.hostname === 'extension-test.ru') {
                let bodyMessageValue: any = {}
                bodyMessageValue['uer-get'] = urlMessageValue;
                const resultTrmId = await testingGet(bodyMessageValue)
                arrayResult['message-value'] = resultTrmId
            } else {
                const resultMessageValue = await productGet(urlMessageValue, {
                    method: "GET",
                    credentials: "include"
                })
                arrayResult['message-value'] = await resultMessageValue.json()
            }
            callback(arrayResult)
            return arrayResult
        },
        getAutofaqStartChat: async (data: any, callback: any) => {
            const arrayResult: any = {
                'start-chat': {},
            }
            const urStartChat = `https://skyeng.autofaq.ai/api/conversation/start?channelId=eca64021-d5e9-4c25-b6e9-03c24s638d4d&userId=${data.userId}&operatorId=${data.operatorAfId}`;
            if (window.location.hostname === 'extension-test.ru') {
                let bodyStartChat: any = {}
                bodyStartChat['uer-get'] = urStartChat;
                bodyStartChat['body'] = null
                bodyStartChat['headers'] = {
                    'content-type': 'application/json'
                }
                bodyStartChat['return'] = 'json'
                bodyStartChat['method'] = 'POST'
                const resultStartChat = await testingGet(bodyStartChat)
                arrayResult['start-chat'] = resultStartChat
            } else {
                const resultStartChat = await productGet(urStartChat, {
                    method: "GET",
                    credentials: "include"
                })
                arrayResult['start-chat'] = await resultStartChat.json()
            }
            callback(arrayResult)
            return arrayResult
        }

    }
}

export { GetterBackground }



