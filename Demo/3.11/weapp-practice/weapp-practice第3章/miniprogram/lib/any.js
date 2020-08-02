// 模拟一个any方法，放在这里，如果不被引用，是不行的
Promise.any = (arr)=>{
  let numTotal = arr.length
  let numSettled = 0
  let resolved = false 
  return new Promise((resolve, reject)=>{
    for(let j=0;j<numTotal;j++){
      let p = arr[j]
      p.then(res=>{
        resolved = true 
        resolve(res)
      },err=>{
        console.log('any err', err);
        reject(err)
      }).finally((res)=>{
        numSettled++
        if (numSettled >= numTotal && !resolved) reject('all failed.')
      })
    }
  })
}