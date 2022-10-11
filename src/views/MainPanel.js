import React, {useState} from 'react';
import {HashRouter as Router, Route, Routes, Link} from 'react-router-dom';
import {RecoilRoot, atom, useRecoilState} from 'recoil';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import axios from 'axios';

import HeadNav from '../components/headnav/HeadNav';
import './MainPanel.style.css';

let userSettingState = atom({
    key: 'userSettingState',
    default: {},
});

let selectState = atom({
    key : 'selectState',
    default : null,
});

const ID_ROOM_0 = "ROOM0";
const ID_ROOM_1 = "ROOM1";
const ID_ROOM_2 = "ROOM2";
const ID_ROOM_3 = "ROOM3";
const ID_ROOM_LIST = [ID_ROOM_0, ID_ROOM_1, ID_ROOM_2, ID_ROOM_3];
const BASE_URL = 'http://localhost:9002/';

function Home() {
    let [userSetting, setUserSetting] = useRecoilState(userSettingState);

    let [userName, setUserName] = useState('');

    const handleOnClick = ()=>{
        // console.log(userName);
        const api = axios.create({
            baseURL: BASE_URL
        }); 
        
        api.post('/User', {
            'userName' : userName
        },
        {
            headers: { 
                'Content-Type' : 'application/json' 
            }
        })
        .then((response) => { 
            console.log('????', response.data);
            setUserSetting(response.data);
        }) 
        .catch((response) => { console.log('Error!', response); });       
    };

    return(
        <>
        <HeadNav>Smart Home Setting</HeadNav>
        <div className='main-page'>
            <div class="card">
                <p class="card-title">이름을 입력하세요</p>
                <input onChange={(e)=>{setUserName(e.target.value)}} type="text" class="form-control"  aria-label="Username" aria-describedby="addon-wrapping"/>
                <hr style={{color:'#D9D9D9'}}/>
                <div className='btn-section'>
                    <Link to="detail">
                        <button type="button" class="btn btn-Ok" onClick={handleOnClick}>Ok</button>
                    </Link>
                </div>
            </div>
        </div>
        </>
    );
};

function putUser(data) {
    console.log('plz', data);
    const api = axios.create({
        baseURL: BASE_URL
    }); 
    
    api.put('/User', data,
    {
        headers: { 
            'Content-Type' : 'application/json' 
        }
    })
    .then((response) => { 
        console.log(response.data);
    }) 
    .catch((response) => { console.log('Error!', response); });    
}

function MySlider(props) {
    let [userSetting, setUserSetting] = useRecoilState(userSettingState);

    const handleOnChange = (e, eset) => {
        console.log(e, eset);
        setUserSetting((current)=>{
            if(props.isTraining) {
                return {
                    ...current,
                    contextSetting: {
                        ...current.contextSetting,
                        [ID_ROOM_LIST[props.index]]: {...current.contextSetting[ID_ROOM_LIST[props.index]], trainingModeBrightness:eset}
                    },
                    
                }
            }
            else {
                return {
                    ...current,
                    contextSetting: {
                        ...current.contextSetting,
                        [ID_ROOM_LIST[props.index]]: {...current.contextSetting[ID_ROOM_LIST[props.index]], sleepingModeBrightness:eset}
                    },
                    
                }
            }
        });
        putUser(userSetting);
    };

    if(Object.keys(userSetting).length) {
        if(props.isTraining) {
            // console.log(props.index, props.isTraining, userSetting.contextSetting[ID_ROOM_LIST[props.index]].trainingModeBrightness);
            return(
                <div>
                    <Slider         
                        defaultValue={userSetting.contextSetting[ID_ROOM_LIST[props.index]].trainingModeBrightness} 
                        aria-label="Default" 
                        valueLabelDisplay="auto" 
                        max={255}
                        onChange={handleOnChange}
                        sx={{
                            width: 300,
                            color: '#e1b5b5',
                          }}
                    >   
                    </Slider>
                </div>
            );
        }
        else {
            // console.log(props.index, props.isTraining, userSetting.contextSetting[ID_ROOM_LIST[props.index]].sleepingModeBrightness);
            return(
                <div>
                    <Slider         
                        defaultValue={userSetting.contextSetting[ID_ROOM_LIST[props.index]].sleepingModeBrightness} 
                        aria-label="Default" 
                        valueLabelDisplay="auto" 
                        max={255}
                        onChange={handleOnChange}
                        sx={{
                            width: 300,
                            color: '#e1b5b5',
                          }}
                    >   
                    </Slider>
                </div>
            );
        }
    }
    else {
        return(
            <div>Waiting server response ...</div>
        );
    }
}

function MyTempButton(props){
    let [userSetting, setUserSetting] = useRecoilState(userSettingState);
    let count;
    
    const handleOnClick = (eset) => {
        setUserSetting((current)=>{
            if(props.isTraining) {
                return {
                    ...current,
                    contextSetting: {
                        ...current.contextSetting,
                        [ID_ROOM_LIST[props.index]]: {...current.contextSetting[ID_ROOM_LIST[props.index]], trainingModeTemperature:eset}
                    },
                    
                }
            }
            else {
                return {
                    ...current,
                    contextSetting: {
                        ...current.contextSetting,
                        [ID_ROOM_LIST[props.index]]: {...current.contextSetting[ID_ROOM_LIST[props.index]], sleepingModeTemperature:eset}
                    },
                    
                }
            }
        });
        putUser(userSetting);
    };
    const up = () => {
        handleOnClick(count+1);
    };
    const down = () => {
        handleOnClick(count-1);
    };

    if(Object.keys(userSetting).length) {
        if(props.isTraining) {
            count = userSetting.contextSetting[ID_ROOM_LIST[props.index]].trainingModeTemperature;
            return(
                <div className='temp-button'>
                    <div className='temp-button-left'>
                        <button onClick={down} type="button">-</button>
                    </div>                
                    <div className='temp-button-center'>
                        {count}*C
                    </div>
                    <div className='temp-button-right'>
                        <button onClick={up} type="button">+</button>
                    </div>
                </div>
            );
        }
        else {
            count = userSetting.contextSetting[ID_ROOM_LIST[props.index]].sleepingModeTemperature;
            return(
                <div className='temp-button'>
                    <div className='temp-button-left'>
                        <button onClick={down} type="button">-</button>
                    </div>                
                    <div className='temp-button-center'>
                        {count}*C
                    </div>
                    <div className='temp-button-right'>
                        <button onClick={up} type="button">+</button>
                    </div>
                </div>
            );
        }
    }
    else {
        return(
            <div>Waiting server response ...</div>
        );
    }
}

function MySwitch(props){
    let [userSetting, setUserSetting] = useRecoilState(userSettingState);

    const handleChange = (e, eset) => {
        console.log(e, eset);
        setUserSetting((current)=>{
            if(props.isTraining) {
                return {
                    ...current,
                    contextSetting: {
                        ...current.contextSetting,
                        [ID_ROOM_LIST[props.index]]: {...current.contextSetting[ID_ROOM_LIST[props.index]], trainingModeAirCleanerStatus:eset}
                    },
                    
                }
            }
            else {
                return {
                    ...current,
                    contextSetting: {
                        ...current.contextSetting,
                        [ID_ROOM_LIST[props.index]]: {...current.contextSetting[ID_ROOM_LIST[props.index]], sleepingModeAirCleanerStatus:eset}
                    },
                    
                }
            }
        });
        putUser(userSetting);
    }
    
    if(Object.keys(userSetting).length) {
        if(props.isTraining) {
            return(
                <Switch
                    defaultChecked={userSetting.contextSetting[ID_ROOM_LIST[props.index]].trainingModeAirCleanerStatus}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                    size='medium'
                />
            );
        }
        else {
            return(
                <Switch
                    defaultChecked={userSetting.contextSetting[ID_ROOM_LIST[props.index]].sleepingModeAirCleanerStatus}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                    size='medium'
                />
            );
        }
    }
    else {
        return(
            <div>Waiting server response ...</div>
        );
    }
}

function TabPanelSection(props) {
    if(props.index != null) {
        return (
            <div className='setting-section'>
                <div className='top-title'>{props.isTraining ? <div>운동할 때</div> : <div>취침 시</div>}</div>
                <div className='text-1'>조명</div> <div className='comp-1'><MySlider {...props}/></div>
                <div className='text-2'>온도</div> <div className='comp-2'><MyTempButton {...props}/></div>
                <div className='text-3'>공기청정</div> <div className='comp-3'><MySwitch {...props}/></div>
            </div>
        );
    }
    else {
        return (
            <div className='setting-section'></div>
        );
    }

}

function MyButton(props) {
    const [select, setSelect] = useRecoilState(selectState);

    const handleOnClick = ()=>{
        setSelect(props.index);
    };

    return (
        <div className={select==props.index ? 'room-select-button-selected' : 'room-select-button'} onClick={handleOnClick}>{props.text}</div>
    );
}

function Detail() {
    const [userSetting, setUserSetting] = useRecoilState(userSettingState);
    const [select, setSelect] = useRecoilState(selectState);

    return (
        <>
        <HeadNav>Samrt Home Settings</HeadNav>
        <div className='detail-main'>
            <div className="namebox-body"> 사용자: { Object.keys(userSetting).length ? userSetting.userName : '' }</div>
            <div class="roombox">
                <div class="roombox-body">
                    <div className='roombox-text'>설정할 공간을 선택해 주세요.</div>
                    <MyButton text={'거실'} index={0}></MyButton>                    
                    <MyButton text={'방 1'} index={1}></MyButton>                    
                    <MyButton text={'방 2'} index={2}></MyButton>                    
                    <MyButton text={'방 3'} index={3}></MyButton>                    
                </div>
            </div>
            <div className='right-side'>
                <div className='right-side-top'>    
                    <TabPanelSection index={select} isTraining={true}></TabPanelSection>
                </div>
                <div className='right-side-bot'>
                    <TabPanelSection index={select} isTraining={false}></TabPanelSection>
                </div>
            </div>
        </div>
        </>
    );
}

function MainPanel() {
  
    return (
        <Router>
            <RecoilRoot>
                <Routes>
                    <Route path="/" exact element={<Home />} />
                    <Route path="detail" element={<Detail />} />   
                </Routes>
            </RecoilRoot>
        </Router>
    );
}
  
export default MainPanel;