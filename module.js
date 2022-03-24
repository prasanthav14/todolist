//-------------------> shorthand method

exports.day = function () {
    var date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return (days[date.getDay()]);
}
exports.month = function () {
    var date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (months[date.getMonth()])
}



//------------------->method 1


// module.exports=dayandmonth
// function dayandmonth(){
// var date=new Date();
// const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// day=days[date.getDay()]
// month=months[date.getMonth()]
// console.log(month);
// return(month)            -------> or return(day)
// }
                          
//---------->var dayandmonth= require(__dirname + "/module.js")
//---------->dayandmonth();





//------------------->method 2


// module.exports.day = day
// function day() {
//     var date = new Date();
//     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     return (days[date.getDay()]);
// }
// module.exports.month = month
// function month() {
//     var date = new Date();
//     const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//     return (months[date.getMonth()])
// }

//---------->var dayandmonth= require(__dirname + "/module.js")
//---------->dayandmonth.day();     or      dayandmonth.month();