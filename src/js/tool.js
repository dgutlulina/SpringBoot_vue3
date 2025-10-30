function undefine(i){
  if("undefined" == typeof i){
    return true
  }else{
    return false
  }
}

function nullZeroBlank( i ){
  if(i==null)
    return true
  else if(typeof(i)=='string'){
    let str=i.replace(' ','').trim()
    if(str.length==0)
      return true
  }else if( i==0 )
    return true

  return false
}

function notNullZeroBlank( i ){
  return !nullZeroBlank( i )
}

export {
  undefine,
  nullZeroBlank,
  notNullZeroBlank
}