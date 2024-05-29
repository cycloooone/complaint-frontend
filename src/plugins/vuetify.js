// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify/dist/vuetify.js'

import { VDataTable, VDataTableServer, VDataTableVirtual } from "vuetify/components";


export default createVuetify({
    components: {
        VDataTable,
        VDataTableServer,
        VDataTableVirtual,
      },
      theme: {
        defaultTheme: 'light'
      },
    
    
    })
