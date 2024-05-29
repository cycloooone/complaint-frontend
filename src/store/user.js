import axios from 'axios'
export default {
    state (){
        return {
            tableData: [],
            isAuthorized: false,
        }
    },
    mutations: {
        setTableData(state, value){
            if(value){
                state.tableData = value
            }
            
        },
        setAuth(state, value){
            state.isAuthorized = value
        }
        
    },
    actions: {
        async GET_USERS( {commit}){

                let data = await axios.get("https://complaint-backend-drab.vercel.app/users");
                console.log(data.data.rows)
                if(!this.USERS){
                    commit("setTableData", data.data.rows)
                }
                
        },
        authorizeUser({commit}){
            commit("setAuth", true)
        },
    },
    getters: {
        USERS(state){
            return state.tableData
        }
    }

    
}