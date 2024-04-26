import './cardComponent.css'
import { useState,useEffect } from 'react';
export default function CardComponent() {
    let [search,setsearch]=useState("");
    let [cities,setcities]=useState([]);
    let [selectedcity,setselectedcity]=useState({});
    let [weathershow,setweathershow]=useState({})

    let handleCityChange=(event)=>{
        console.log(event);
        setsearch(event.target.value);
    }
    let handleClick=(city)=>{
        let todayDate=new Date();
        console.log(todayDate.getDate());
        console.log(city);
        setselectedcity(city); 
    }

    const getWeatherUpdate=async()=>{
        let todayDate=new Date();
        let date=todayDate.getFullYear()+'-'+(todayDate.getMonth()>10?todayDate.getMonth():'0'+todayDate.getMonth())+'-'+(todayDate.getDate()>10?todayDate.getDate():'0'+todayDate.getDate());
        try{const response=await fetch(`https://api.open-meteo.com/v1/dwd-icon?latitude=${selectedcity.latitude}&longitude=${selectedcity.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&start_date=${date}&end_date=${date}`,{
            
        }).then((res)=>{
            return res.json();
        }).then((results) => {return results;})
        
        .catch((err)=>{
            console.error(err);
        })
        return response;}
        catch(err){
            console.error(err);
        }
     
        
    }


    const callCityAPI = async () => {
        try{
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${search}`,{}).then((res)=>{
            return res.json()
        }).then((results) => {return results;}).catch((err)=>{
            console.error(err);
        })
        return response;
        }
        catch(err) {
            console.error(err);
        }
        
        
    };

    useEffect(()=>{
        if(Object.keys(selectedcity).length!==0){
            const fetchData = async () => {
                const weatherData=await getWeatherUpdate();
                setcities([])
                console.log(weatherData);
                setweathershow(weatherData);
            };
            fetchData()
        }
    },[selectedcity])


    
    useEffect(() => {
        const fetchData = async () => {
            if (search.length !== 0) {
                const res = await callCityAPI();
                console.log(res);
                setcities(res.results||[]);
            }
        };
    
        fetchData();
    
    }, [search]);
    

    return (
        <div className='center-div'>
            <div className="card">
            <div className="card-header">
                <span className='header'>Weather Update</span>
            </div>
            <div className='bottom-left-quarter-circle'></div>
            <div className="card-body">
                <div className='flex-row'>
                    <span style={{display:"inline-flex",alignItems:"center",fontWeight:"700",fontSize:"0.9rem"}}>Search by City</span>
                    <div style={{width:"80%",position:"relative"}}> 
                    <input className='input_tag' placeholder='Search city' onChange={(e)=>handleCityChange(e)} type="text" name="" id="" />
                    {cities?.length>0 &&<div className='searchPopup' > 
                        {cities?.map((city,index)=>{
                            return <div key={index} onClick={()=>handleClick(city)} className='searchPopup-item' >{city?.name},{city?.country}</div>
                        })}
                    </div>}
                    </div>
                    
                </div>

                {Object.keys(weathershow)?.length>0 && <div className='mainData'>
                    <span className='selectedCity'>{selectedcity.name}, {selectedcity.country}:</span>
                    <div className='flex-wrap-box'>
                        <div className='detail-box' style={{display:"flex",flexDirection:"column"}}>
                            <span className='title'>🌡️ Temperature</span>
                            <span style={{textAlign:"center"}} className='title'>{weathershow?.current?.temperature_2m} {weathershow?.current_units?.temperature_2m} </span>
                        </div>
                        <div className='detail-box' style={{display:"flex",flexDirection:"column"}}>
                            <span className='title'>🫧 Humidity</span>
                            <span style={{textAlign:"center"}} className='title'> {weathershow?.current?.relative_humidity_2m} {weathershow?.current_units?.relative_humidity_2m}</span>
                        </div>
                        <div className='detail-box' style={{display:"flex",flexDirection:"column",position:"relative"}}>
                            <span className='title'>🌪️ Wind Speed</span>
                            <span style={{textAlign:"center"}} className='title'> {weathershow?.current?.wind_speed_10m} {weathershow?.current_units?.relative_humidity_2m}</span>
                        </div>
                    </div>
                </div>}
            </div>
        </div>  
        </div>
    );
}