export const formatCallDuration=(seconds:number)=>{
    const totalSeconds=Number(seconds)||0;

    const hours=Math.floor(totalSeconds/3600);
    const minutes=Math.floor((totalSeconds%3600)/60);
    const remainingSeconds=totalSeconds%60;

    return [hours,minutes,remainingSeconds].map((value)=>String(value).padStart(2,"0")).join(":");
}