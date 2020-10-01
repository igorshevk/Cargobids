import api from "../services/api";

let datas = {}

              api.customer({customer_id : 'cus_Gnc9gJ8pyIotiA',},(err, response)=>{
                    if(response){
                          console.log(response);
                          var tifOptions = Object.keys(response).map(function(key) {
                              console.log(key);
                              let res = response['email'];
                              console.log(res);
                              datas['title'] =  res
                          })
                        }else{
                           // console.log(err);
                        }

               })



const data = [
 datas

//  {
//    title: 'Cargo',
//    date: '21/11/19',
//    dest: 'BOG',
//    origin: 'FCO',
//    pcs: 1,
//    weight: 6677.00,
//    vol: 3.0,
//    readyOn: '29/11/19',
//    id: 1
//  }

]
export default data
  