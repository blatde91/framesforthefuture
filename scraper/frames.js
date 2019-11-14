const jquery = require('jquery');
const fs = require('fs');
const Nightmare = require('nightmare');

nightmare = Nightmare();

nightmare
  .goto('http://ensabahnur.free.fr/BastonNew/index.php?id=18')
  .wait(2000)
  .evaluate(() => {
    const names = [];
    const startup = [];
    const hit = [];
    const recovery = [];
    const block = [];
    const onHit = [];
    const crHit = [];
    const parry = [];
    const damage = [];
    const stun = [];

    $('tr.fd_tr_hover > td:nth-child(2)').each(function () {
      let item = $(this).text();
      item = item.replace('Crouching', 'Cr.');
      item = item.replace('Jumping', 'J.');
      item = item.replace('Towards', 'Twd.');
      names.push(item);
    });
    $('tr.fd_tr_hover > td:nth-child(3)').each(function () {
      const item = $(this).text();
      startup.push(item);
    });
    $('tr.fd_tr_hover > td:nth-child(4)').each(function () {
      const item = $(this).text();
      hit.push(item);
    });
    $('tr.fd_tr_hover > td:nth-child(5)').each(function () {
      const item = $(this).text();
      recovery.push(item);
    });
    $('tr.fd_tr_hover > td:nth-child(6)').each(function () {
      const item = $(this).text();
      block.push(item);
    });
    $('tr.fd_tr_hover > td:nth-child(7)').each(function () {
      const item = $(this).text();
      onHit.push(item);
    });
    $('tr.fd_tr_hover > td:nth-child(8)').each(function () {
      const item = $(this).text();
      crHit.push(item);
    });
    $('tr.fd_tr_hover > td:nth-child(10)').each(function () {
      const item = $(this).text();
      parry.push(item);
    });
    $('tr.fd_tr_hover > td:nth-child(13)').each(function () {
      const item = $(this).text();
      damage.push(item);
    });
    $('tr.fd_tr_hover > td:nth-child(14)').each(function () {
      const item = $(this).text();
      stun.push(item);
    });
    const normals = names.map((name, i) => ({
      move: {
        name,
        startup: startup[i],
        hit: hit[i],
        recovery: recovery[i],
        blockAdv: block[i],
        hitAdv: onHit[i],
        crHitAdv: crHit[i],
        parry: parry[i],
        damage: damage[i],
        stun: stun[i],
      },
    }));

    return normals;
  })
  .end()
  .then((res) => {
    fs.writeFile('Q.json', JSON.stringify(res, null, 2), (err) => {
      if (err) throw err;
    });
  });
