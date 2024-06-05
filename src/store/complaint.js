import axios from 'axios'
export default {
    state (){
        return {
            complaints:[],
            complaint_loading:false,
        }
    },
    mutations: {
        setComplaints(state, value){
            if(value){
                state.complaints = value
            }
        },setComplaintLoading(state, value){
            state.complaint_loading=value
        }
        
    },
    actions: {
        async GET_COMPLAINTS({commit}){
            commit("setComplaintLoading", true);
            let data = await axios.get("https://complaint-backend-drab.vercel.app/complaint");
            if(data.data !== this.COMPLAINTS){
                commit("setComplaints", data.data)
            }   
            commit("setComplaintLoading", false);
        },
    },
    getters: {
        COMPLAINTS(state){
            return state.complaints
        },
        COMPLAINT_LOADING(state){
            return state.complaint_loading
        }
    }

    
}