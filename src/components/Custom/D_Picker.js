import React,{useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import DatePicker from 'react-native-datepicker'

const D_Picker = () => {
    const [date, setDate] = useState("2016-05-15")

    return (
        <View>
            <DatePicker
                style={{width: 160}}
                date={date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="1940-01-01"
                maxDate="2021-08-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                    
                },
                dateInput: {
                    marginLeft: 36
                }
                // ... You can check the source to find the other keys.
                }}
                    onDateChange={(date) => {setDate(date)}}
            />
        </View>
    )
}

export default D_Picker

const styles = StyleSheet.create({})
