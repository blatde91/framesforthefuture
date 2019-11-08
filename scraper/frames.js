const jquery = require('jquery')
const fs = require('fs')
let Nightmare = require('nightmare');
  nightmare = Nightmare();


nightmare.goto('http://ensabahnur.free.fr/BastonNew/index.php?id=1')
  .wait(2000)
  .evaluate(function(){
    
    const names = [];
    const startup = [];
    const hit = [];
    const recovery = [];
    const block = [];
    const onHit = [];
    const crHit = [];

    $('tr.fd_tr_hover > td:nth-child(2)').each(function(){
      const item = $(this).text()
      names.push(item)
    })
    $('tr.fd_tr_hover > td:nth-child(3)').each(function(){
      const item = $(this).text()
      startup.push(item)
    })
    $('tr.fd_tr_hover > td:nth-child(4)').each(function(){
      const item = $(this).text()
      hit.push(item)
    })
    $('tr.fd_tr_hover > td:nth-child(5)').each(function(){
      const item = $(this).text()
      recovery.push(item)
    })
    $('tr.fd_tr_hover > td:nth-child(6)').each(function(){
      const item = $(this).text()
      block.push(item)
    })
    $('tr.fd_tr_hover > td:nth-child(7)').each(function(){
      const item = $(this).text()
      onHit.push(item)
    })
    $('tr.fd_tr_hover > td:nth-child(8)').each(function(){
      const item = $(this).text()
      crHit.push(item)
    })
    const normals = names.map((name, i) => {
      return {
        [name]: {
          startup: startup[i],
          hit: hit[i],
          recovery: recovery[i],
          blockAdv: block[i],
          hitAdv: onHit[i],
          crHitAdv: crHit[i],
        }
      }
    })
    return normals;

  })
  .end()
  .then(function(res){
    for(normals in res) {
      console.log[res[normals]];
      // fs.writeFile('Alex.json', JSON.stringify(res[normals]), err => {
      //   if(err) throw err;
      })
    }
  })
