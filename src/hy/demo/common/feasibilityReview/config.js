//  仅数字类型值校验
const checkValue = (rule, value, callback) => {
    let reg = /^\d{1,}$/;
    if(!value) {
        return callback()
    }
    if(!reg.test(value)) {
        callback(new Error('请输入数字值'))
    }else {
        return callback()
    }
}

export const buttonData = [
    {
      id: "primary",
      text: "通过",
    },
    {
      id: "danger",
      text: "驳回",
    },
    {
      id: "",
      text: "返回",
    }
]

export const zszjFormConfig = {
     formConfig: [{
        type: "select",
        placeholder: '请选择',
        label: '评审结论',
        key: 'psjl',
        clearable:true,
        width: 312,
        options: [],
        labelName: "dataLabel",
        labeKey: "dataVal"
  
      }],
      formData: {
          psjl: ''
      },
      rules:  Object.freeze({
          psjl: [{required:true,message: '请选择评审结论',trigger: 'change'}],
      })
}
