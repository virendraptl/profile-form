import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from 'src/app/services/header-title/header-title.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  // productsArr = [
  //   [
  //     {
  //       public_id: 'training-api/cv6hj7x9odrjl4tghc34',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821263/training-api/cv6hj7x9odrjl4tghc34.jpg',
  //     },
  //     {
  //       public_id: 'training-api/hqcwjj6slsjng8iucyci',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821264/training-api/hqcwjj6slsjng8iucyci.jpg',
  //     },
  //     {
  //       public_id: 'training-api/heuk0axht8xp3b4pqt3i',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821264/training-api/heuk0axht8xp3b4pqt3i.jpg',
  //     },
  //     {
  //       public_id: 'training-api/xchm8vdxtdjufdvjhf7e',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821265/training-api/xchm8vdxtdjufdvjhf7e.jpg',
  //     },
  //     {
  //       public_id: 'training-api/zxbxlcq8urkjlpsnpiwt',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821265/training-api/zxbxlcq8urkjlpsnpiwt.jpg',
  //     },
  //     {
  //       public_id: 'training-api/ticek974hp8zyhnllp2z',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821266/training-api/ticek974hp8zyhnllp2z.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/sglr0aohpx3lidma3rn1',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909005/training-api/sglr0aohpx3lidma3rn1.jpg',
  //     },
  //     {
  //       public_id: 'training-api/x15b4w78s488cj8rhfb4',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909006/training-api/x15b4w78s488cj8rhfb4.jpg',
  //     },
  //     {
  //       public_id: 'training-api/espa2isdjwfngkkb7tyb',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909007/training-api/espa2isdjwfngkkb7tyb.jpg',
  //     },
  //     {
  //       public_id: 'training-api/dwmmfi9zmpr3lxatmxww',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909007/training-api/dwmmfi9zmpr3lxatmxww.jpg',
  //     },
  //     {
  //       public_id: 'training-api/ybfettn5jusqzrim4fy6',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909008/training-api/ybfettn5jusqzrim4fy6.jpg',
  //     },
  //     {
  //       public_id: 'training-api/uuvbcrw43zaoli7zjxiz',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909008/training-api/uuvbcrw43zaoli7zjxiz.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/sazvgekbmov07ri82xdo',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912173/training-api/sazvgekbmov07ri82xdo.jpg',
  //     },
  //     {
  //       public_id: 'training-api/kdofzcj0l5f4es8ukc01',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912174/training-api/kdofzcj0l5f4es8ukc01.jpg',
  //     },
  //     {
  //       public_id: 'training-api/jn9xib9yzoybobsbq1s2',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912174/training-api/jn9xib9yzoybobsbq1s2.jpg',
  //     },
  //     {
  //       public_id: 'training-api/p9o9neuvytzta0jtbwsl',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912175/training-api/p9o9neuvytzta0jtbwsl.jpg',
  //     },
  //     {
  //       public_id: 'training-api/cx4oz5dzakxlaq3jly8v',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912175/training-api/cx4oz5dzakxlaq3jly8v.jpg',
  //     },
  //     {
  //       public_id: 'training-api/p36rgrlsctxgwjgonldh',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912176/training-api/p36rgrlsctxgwjgonldh.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/wh3ec2efriofsldtqhpe',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914684/training-api/wh3ec2efriofsldtqhpe.jpg',
  //     },
  //     {
  //       public_id: 'training-api/dytziuqjvvko8pllxygr',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914685/training-api/dytziuqjvvko8pllxygr.jpg',
  //     },
  //     {
  //       public_id: 'training-api/qpgyaedzki4byv883fpb',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914686/training-api/qpgyaedzki4byv883fpb.jpg',
  //     },
  //     {
  //       public_id: 'training-api/qkhzsz5o3ftzwxen3awq',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914687/training-api/qkhzsz5o3ftzwxen3awq.jpg',
  //     },
  //     {
  //       public_id: 'training-api/fgmsawbjflk4uc2ffbr7',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914688/training-api/fgmsawbjflk4uc2ffbr7.jpg',
  //     },
  //     {
  //       public_id: 'training-api/meirgczmetwpckiivvfb',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914689/training-api/meirgczmetwpckiivvfb.jpg',
  //     },
  //     {
  //       public_id: 'training-api/lbjtkn9ux7k0elzvexmk',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1659078950/training-api/lbjtkn9ux7k0elzvexmk.jpg',
  //     },
  //     {
  //       public_id: 'training-api/tfl1hizvlk0veminkqwg',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1659078951/training-api/tfl1hizvlk0veminkqwg.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/cv6hj7x9odrjl4tghc34',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821263/training-api/cv6hj7x9odrjl4tghc34.jpg',
  //     },
  //     {
  //       public_id: 'training-api/hqcwjj6slsjng8iucyci',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821264/training-api/hqcwjj6slsjng8iucyci.jpg',
  //     },
  //     {
  //       public_id: 'training-api/heuk0axht8xp3b4pqt3i',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821264/training-api/heuk0axht8xp3b4pqt3i.jpg',
  //     },
  //     {
  //       public_id: 'training-api/xchm8vdxtdjufdvjhf7e',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821265/training-api/xchm8vdxtdjufdvjhf7e.jpg',
  //     },
  //     {
  //       public_id: 'training-api/zxbxlcq8urkjlpsnpiwt',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821265/training-api/zxbxlcq8urkjlpsnpiwt.jpg',
  //     },
  //     {
  //       public_id: 'training-api/ticek974hp8zyhnllp2z',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821266/training-api/ticek974hp8zyhnllp2z.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/sglr0aohpx3lidma3rn1',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909005/training-api/sglr0aohpx3lidma3rn1.jpg',
  //     },
  //     {
  //       public_id: 'training-api/x15b4w78s488cj8rhfb4',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909006/training-api/x15b4w78s488cj8rhfb4.jpg',
  //     },
  //     {
  //       public_id: 'training-api/espa2isdjwfngkkb7tyb',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909007/training-api/espa2isdjwfngkkb7tyb.jpg',
  //     },
  //     {
  //       public_id: 'training-api/dwmmfi9zmpr3lxatmxww',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909007/training-api/dwmmfi9zmpr3lxatmxww.jpg',
  //     },
  //     {
  //       public_id: 'training-api/ybfettn5jusqzrim4fy6',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909008/training-api/ybfettn5jusqzrim4fy6.jpg',
  //     },
  //     {
  //       public_id: 'training-api/uuvbcrw43zaoli7zjxiz',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909008/training-api/uuvbcrw43zaoli7zjxiz.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/sazvgekbmov07ri82xdo',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912173/training-api/sazvgekbmov07ri82xdo.jpg',
  //     },
  //     {
  //       public_id: 'training-api/kdofzcj0l5f4es8ukc01',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912174/training-api/kdofzcj0l5f4es8ukc01.jpg',
  //     },
  //     {
  //       public_id: 'training-api/jn9xib9yzoybobsbq1s2',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912174/training-api/jn9xib9yzoybobsbq1s2.jpg',
  //     },
  //     {
  //       public_id: 'training-api/p9o9neuvytzta0jtbwsl',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912175/training-api/p9o9neuvytzta0jtbwsl.jpg',
  //     },
  //     {
  //       public_id: 'training-api/cx4oz5dzakxlaq3jly8v',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912175/training-api/cx4oz5dzakxlaq3jly8v.jpg',
  //     },
  //     {
  //       public_id: 'training-api/p36rgrlsctxgwjgonldh',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912176/training-api/p36rgrlsctxgwjgonldh.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/wh3ec2efriofsldtqhpe',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914684/training-api/wh3ec2efriofsldtqhpe.jpg',
  //     },
  //     {
  //       public_id: 'training-api/dytziuqjvvko8pllxygr',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914685/training-api/dytziuqjvvko8pllxygr.jpg',
  //     },
  //     {
  //       public_id: 'training-api/qpgyaedzki4byv883fpb',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914686/training-api/qpgyaedzki4byv883fpb.jpg',
  //     },
  //     {
  //       public_id: 'training-api/qkhzsz5o3ftzwxen3awq',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914687/training-api/qkhzsz5o3ftzwxen3awq.jpg',
  //     },
  //     {
  //       public_id: 'training-api/fgmsawbjflk4uc2ffbr7',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914688/training-api/fgmsawbjflk4uc2ffbr7.jpg',
  //     },
  //     {
  //       public_id: 'training-api/meirgczmetwpckiivvfb',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914689/training-api/meirgczmetwpckiivvfb.jpg',
  //     },
  //     {
  //       public_id: 'training-api/lbjtkn9ux7k0elzvexmk',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1659078950/training-api/lbjtkn9ux7k0elzvexmk.jpg',
  //     },
  //     {
  //       public_id: 'training-api/tfl1hizvlk0veminkqwg',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1659078951/training-api/tfl1hizvlk0veminkqwg.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/cv6hj7x9odrjl4tghc34',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821263/training-api/cv6hj7x9odrjl4tghc34.jpg',
  //     },
  //     {
  //       public_id: 'training-api/hqcwjj6slsjng8iucyci',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821264/training-api/hqcwjj6slsjng8iucyci.jpg',
  //     },
  //     {
  //       public_id: 'training-api/heuk0axht8xp3b4pqt3i',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821264/training-api/heuk0axht8xp3b4pqt3i.jpg',
  //     },
  //     {
  //       public_id: 'training-api/xchm8vdxtdjufdvjhf7e',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821265/training-api/xchm8vdxtdjufdvjhf7e.jpg',
  //     },
  //     {
  //       public_id: 'training-api/zxbxlcq8urkjlpsnpiwt',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821265/training-api/zxbxlcq8urkjlpsnpiwt.jpg',
  //     },
  //     {
  //       public_id: 'training-api/ticek974hp8zyhnllp2z',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821266/training-api/ticek974hp8zyhnllp2z.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/sglr0aohpx3lidma3rn1',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909005/training-api/sglr0aohpx3lidma3rn1.jpg',
  //     },
  //     {
  //       public_id: 'training-api/x15b4w78s488cj8rhfb4',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909006/training-api/x15b4w78s488cj8rhfb4.jpg',
  //     },
  //     {
  //       public_id: 'training-api/espa2isdjwfngkkb7tyb',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909007/training-api/espa2isdjwfngkkb7tyb.jpg',
  //     },
  //     {
  //       public_id: 'training-api/dwmmfi9zmpr3lxatmxww',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909007/training-api/dwmmfi9zmpr3lxatmxww.jpg',
  //     },
  //     {
  //       public_id: 'training-api/ybfettn5jusqzrim4fy6',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909008/training-api/ybfettn5jusqzrim4fy6.jpg',
  //     },
  //     {
  //       public_id: 'training-api/uuvbcrw43zaoli7zjxiz',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909008/training-api/uuvbcrw43zaoli7zjxiz.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/sazvgekbmov07ri82xdo',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912173/training-api/sazvgekbmov07ri82xdo.jpg',
  //     },
  //     {
  //       public_id: 'training-api/kdofzcj0l5f4es8ukc01',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912174/training-api/kdofzcj0l5f4es8ukc01.jpg',
  //     },
  //     {
  //       public_id: 'training-api/jn9xib9yzoybobsbq1s2',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912174/training-api/jn9xib9yzoybobsbq1s2.jpg',
  //     },
  //     {
  //       public_id: 'training-api/p9o9neuvytzta0jtbwsl',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912175/training-api/p9o9neuvytzta0jtbwsl.jpg',
  //     },
  //     {
  //       public_id: 'training-api/cx4oz5dzakxlaq3jly8v',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912175/training-api/cx4oz5dzakxlaq3jly8v.jpg',
  //     },
  //     {
  //       public_id: 'training-api/p36rgrlsctxgwjgonldh',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912176/training-api/p36rgrlsctxgwjgonldh.jpg',
  //     },
  //   ],
  //   [
  //     {
  //       public_id: 'training-api/wh3ec2efriofsldtqhpe',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914684/training-api/wh3ec2efriofsldtqhpe.jpg',
  //     },
  //     {
  //       public_id: 'training-api/dytziuqjvvko8pllxygr',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914685/training-api/dytziuqjvvko8pllxygr.jpg',
  //     },
  //     {
  //       public_id: 'training-api/qpgyaedzki4byv883fpb',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914686/training-api/qpgyaedzki4byv883fpb.jpg',
  //     },
  //     {
  //       public_id: 'training-api/qkhzsz5o3ftzwxen3awq',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914687/training-api/qkhzsz5o3ftzwxen3awq.jpg',
  //     },
  //     {
  //       public_id: 'training-api/fgmsawbjflk4uc2ffbr7',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914688/training-api/fgmsawbjflk4uc2ffbr7.jpg',
  //     },
  //     {
  //       public_id: 'training-api/meirgczmetwpckiivvfb',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914689/training-api/meirgczmetwpckiivvfb.jpg',
  //     },
  //     {
  //       public_id: 'training-api/lbjtkn9ux7k0elzvexmk',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1659078950/training-api/lbjtkn9ux7k0elzvexmk.jpg',
  //     },
  //     {
  //       public_id: 'training-api/tfl1hizvlk0veminkqwg',
  //       url: 'http://res.cloudinary.com/abs-am/image/upload/v1659078951/training-api/tfl1hizvlk0veminkqwg.jpg',
  //     },
  //   ],
  // ];

  productsArr = [
    {
      _id: '62df9a92305fe3040d7f7954',
      _org: '62b16906d57e26bc03dd9866',
      name: 'lot of boxes',
      description:
        'Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.\nLorem ipsum dolor sit amet.\nLorem ipsum dolor sit amet.\nLorem ipsum dolor sit amet.\nLorem ipsum dolor sit amet.\nLorem ipsum dolor sit amet.\nLorem ipsum dolor sit amet.',
      images: [
        {
          public_id: 'training-api/cv6hj7x9odrjl4tghc34',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821263/training-api/cv6hj7x9odrjl4tghc34.jpg',
        },
        {
          public_id: 'training-api/hqcwjj6slsjng8iucyci',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821264/training-api/hqcwjj6slsjng8iucyci.jpg',
        },
        {
          public_id: 'training-api/heuk0axht8xp3b4pqt3i',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821264/training-api/heuk0axht8xp3b4pqt3i.jpg',
        },
        {
          public_id: 'training-api/xchm8vdxtdjufdvjhf7e',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821265/training-api/xchm8vdxtdjufdvjhf7e.jpg',
        },
        {
          public_id: 'training-api/zxbxlcq8urkjlpsnpiwt',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821265/training-api/zxbxlcq8urkjlpsnpiwt.jpg',
        },
        {
          public_id: 'training-api/ticek974hp8zyhnllp2z',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658821266/training-api/ticek974hp8zyhnllp2z.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-26T07:41:06.351Z',
      updatedAt: '2022-07-26T07:41:06.351Z',
    },
    {
      _id: '62e0f1517ce98721268d5601',
      _org: '62b16906d57e26bc03dd9866',
      name: 'Car',
      description:
        'A sports car is a car designed with an emphasis on dynamic performance, such as handling, acceleration, top speed, or thrill of driving. Sports cars originated in Europe in the early 1900s and are currently produced by many manufacturers around the world.',
      images: [
        {
          public_id: 'training-api/sglr0aohpx3lidma3rn1',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909005/training-api/sglr0aohpx3lidma3rn1.jpg',
        },
        {
          public_id: 'training-api/x15b4w78s488cj8rhfb4',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909006/training-api/x15b4w78s488cj8rhfb4.jpg',
        },
        {
          public_id: 'training-api/espa2isdjwfngkkb7tyb',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909007/training-api/espa2isdjwfngkkb7tyb.jpg',
        },
        {
          public_id: 'training-api/dwmmfi9zmpr3lxatmxww',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909007/training-api/dwmmfi9zmpr3lxatmxww.jpg',
        },
        {
          public_id: 'training-api/ybfettn5jusqzrim4fy6',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909008/training-api/ybfettn5jusqzrim4fy6.jpg',
        },
        {
          public_id: 'training-api/uuvbcrw43zaoli7zjxiz',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658909008/training-api/uuvbcrw43zaoli7zjxiz.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-27T08:03:29.055Z',
      updatedAt: '2022-07-27T08:03:29.055Z',
    },
    {
      _id: '62e0fdb05cd103932596e7e3',
      _org: '62b16906d57e26bc03dd9866',
      name: 'LED TV',
      description:
        'LED TV is a type of LCD television that uses light-emitting diodes (LEDs) to backlight the display instead of the cold cathode fluorescent lights (CCFLs) used in standard LCD televisions. LED TVs are more formally known as LED-backlight LCD television.',
      images: [
        {
          public_id: 'training-api/sazvgekbmov07ri82xdo',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912173/training-api/sazvgekbmov07ri82xdo.jpg',
        },
        {
          public_id: 'training-api/kdofzcj0l5f4es8ukc01',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912174/training-api/kdofzcj0l5f4es8ukc01.jpg',
        },
        {
          public_id: 'training-api/jn9xib9yzoybobsbq1s2',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912174/training-api/jn9xib9yzoybobsbq1s2.jpg',
        },
        {
          public_id: 'training-api/p9o9neuvytzta0jtbwsl',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912175/training-api/p9o9neuvytzta0jtbwsl.jpg',
        },
        {
          public_id: 'training-api/cx4oz5dzakxlaq3jly8v',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912175/training-api/cx4oz5dzakxlaq3jly8v.jpg',
        },
        {
          public_id: 'training-api/p36rgrlsctxgwjgonldh',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658912176/training-api/p36rgrlsctxgwjgonldh.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-27T08:56:16.971Z',
      updatedAt: '2022-07-27T08:56:16.971Z',
    },
    {
      _id: '62e107825cd103932596efc1',
      _org: '62b16906d57e26bc03dd9866',
      name: 'Shoes',
      description:
        '"Reebok celebrates their individuality, their authenticity and the courage it takes to forge their own path to greatness. While some may call them crazy or eccentric, Reebok calls them visionary and original. Commitment to Corporate Responsibility is an important legacy and hallmark of the Reebok brand."',
      images: [
        {
          public_id: 'training-api/wh3ec2efriofsldtqhpe',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914684/training-api/wh3ec2efriofsldtqhpe.jpg',
        },
        {
          public_id: 'training-api/dytziuqjvvko8pllxygr',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914685/training-api/dytziuqjvvko8pllxygr.jpg',
        },
        {
          public_id: 'training-api/qpgyaedzki4byv883fpb',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914686/training-api/qpgyaedzki4byv883fpb.jpg',
        },
        {
          public_id: 'training-api/qkhzsz5o3ftzwxen3awq',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914687/training-api/qkhzsz5o3ftzwxen3awq.jpg',
        },
        {
          public_id: 'training-api/fgmsawbjflk4uc2ffbr7',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914688/training-api/fgmsawbjflk4uc2ffbr7.jpg',
        },
        {
          public_id: 'training-api/meirgczmetwpckiivvfb',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914689/training-api/meirgczmetwpckiivvfb.jpg',
        },
        {
          public_id: 'training-api/lbjtkn9ux7k0elzvexmk',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659078950/training-api/lbjtkn9ux7k0elzvexmk.jpg',
        },
        {
          public_id: 'training-api/tfl1hizvlk0veminkqwg',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659078951/training-api/tfl1hizvlk0veminkqwg.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-27T09:38:10.193Z',
      updatedAt: '2022-07-29T07:15:51.872Z',
    },
    {
      _id: '62e108855cd103932596f0a9',
      _org: '62b16906d57e26bc03dd9866',
      name: 'TV',
      description:
        '"LED TV is a type of LCD television that uses light-emitting diodes (LEDs) to backlight the display instead of the cold cathode fluorescent lights (CCFLs) used in standard LCD televisions. LED TVs are more formally known as LED-backlight LCD television."',
      images: [
        {
          public_id: 'training-api/rqb04sedkqslkwpkeenv',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914948/training-api/rqb04sedkqslkwpkeenv.jpg',
        },
        {
          public_id: 'training-api/wealq3fbbykfnvxfzu2w',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914949/training-api/wealq3fbbykfnvxfzu2w.jpg',
        },
        {
          public_id: 'training-api/thnsppi2dcmq7m6j0ijb',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658914949/training-api/thnsppi2dcmq7m6j0ijb.jpg',
        },
        {
          public_id: 'training-api/xagdioif5a32z6wm5vv0',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659326826/training-api/xagdioif5a32z6wm5vv0.jpg',
        },
        {
          public_id: 'training-api/hmaejkrrcu0acnuocqrf',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659329084/training-api/hmaejkrrcu0acnuocqrf.jpg',
        },
        {
          public_id: 'training-api/wojwuvulb0wd4lhhvrpq',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659329085/training-api/wojwuvulb0wd4lhhvrpq.jpg',
        },
        {
          public_id: 'training-api/oijarcfphq5u0mokjvqj',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659329622/training-api/oijarcfphq5u0mokjvqj.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-27T09:42:29.931Z',
      updatedAt: '2022-08-01T04:53:42.834Z',
    },
    {
      _id: '62e108e85cd103932596f0e4',
      _org: '62b16906d57e26bc03dd9866',
      name: 'Puma Shoes',
      description:
        '"Reebok celebrates their individuality, their authenticity and the courage it takes to forge their own path to greatness. While some may call them crazy or eccentric, Reebok calls them visionary and original. Commitment to Corporate Responsibility is an important legacy and hallmark of the Reebok brand."',
      images: [
        {
          public_id: 'training-api/dyceybzrdsiyd7aup6an',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658915046/training-api/dyceybzrdsiyd7aup6an.jpg',
        },
        {
          public_id: 'training-api/naozwywng2obgvasiizr',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658915047/training-api/naozwywng2obgvasiizr.jpg',
        },
        {
          public_id: 'training-api/bpezkdi9jakgctiofisj',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658915047/training-api/bpezkdi9jakgctiofisj.jpg',
        },
        {
          public_id: 'training-api/q94bixfzezgi4kkodgpe',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659006333/training-api/q94bixfzezgi4kkodgpe.jpg',
        },
        {
          public_id: 'training-api/i8fp2tuvdppvpukmndtk',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659006334/training-api/i8fp2tuvdppvpukmndtk.jpg',
        },
        {
          public_id: 'training-api/bac5l8wxcclfbfbnalpl',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659006335/training-api/bac5l8wxcclfbfbnalpl.jpg',
        },
        {
          public_id: 'training-api/naaszhq8vrx5duf8ffra',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659006335/training-api/naaszhq8vrx5duf8ffra.jpg',
        },
        {
          public_id: 'training-api/trtpfgao7dkdiybti4dd',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659006336/training-api/trtpfgao7dkdiybti4dd.jpg',
        },
        {
          public_id: 'training-api/mbrvpjvwu3eufm2bajtf',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659006337/training-api/mbrvpjvwu3eufm2bajtf.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-27T09:44:08.212Z',
      updatedAt: '2022-07-29T03:58:40.863Z',
    },
    {
      _id: '62e109575cd103932596f135',
      _org: '62b16906d57e26bc03dd9866',
      name: 'Smart TV',
      description:
        '"LED TV is a type of LCD television that uses light-emitting diodes (LEDs) to backlight the display instead of the cold cathode fluorescent lights (CCFLs) used in standard LCD televisions. LED TVs are more formally known as LED-backlight LCD television."',
      images: [
        {
          public_id: 'training-api/oink8she56ugucikgu79',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658915156/training-api/oink8she56ugucikgu79.jpg',
        },
        {
          public_id: 'training-api/ww8dhdzewlvxuimvl2fx',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658915157/training-api/ww8dhdzewlvxuimvl2fx.jpg',
        },
        {
          public_id: 'training-api/wkvbaajsbc33ktswfk9j',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658915157/training-api/wkvbaajsbc33ktswfk9j.jpg',
        },
        {
          public_id: 'training-api/qpoo395vg6dycyryvwib',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658915158/training-api/qpoo395vg6dycyryvwib.jpg',
        },
        {
          public_id: 'training-api/orsyzxlwf1n8ebuoccsz',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658915158/training-api/orsyzxlwf1n8ebuoccsz.jpg',
        },
        {
          public_id: 'training-api/iqxvqc7phce2ufpix09p',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658915159/training-api/iqxvqc7phce2ufpix09p.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-27T09:45:59.816Z',
      updatedAt: '2022-07-27T09:45:59.816Z',
    },
    {
      _id: '62e1299d5cd1039325970050',
      _org: '62b16906d57e26bc03dd9866',
      name: 'Random Products',
      description:
        '""Reebok celebrates their individuality, their authenticity and the courage it takes to forge their own path to greatness. While some may call them crazy or eccentric, Reebok calls them visionary and original. Commitment to',
      images: [
        {
          public_id: 'training-api/asokgqcl0gnxsuq1qixh',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923414/training-api/asokgqcl0gnxsuq1qixh.jpg',
        },
        {
          public_id: 'training-api/binp4wf2gw7is8wwgagz',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923415/training-api/binp4wf2gw7is8wwgagz.jpg',
        },
        {
          public_id: 'training-api/jrpp6mjgbyx5dfnm68o0',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923416/training-api/jrpp6mjgbyx5dfnm68o0.jpg',
        },
        {
          public_id: 'training-api/iufiwkyasd6vy75yoi2s',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923416/training-api/iufiwkyasd6vy75yoi2s.jpg',
        },
        {
          public_id: 'training-api/qdm8irqhz7fb5orz6mph',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923417/training-api/qdm8irqhz7fb5orz6mph.jpg',
        },
        {
          public_id: 'training-api/l7k3cn9fbxkwcqt3vg4r',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923417/training-api/l7k3cn9fbxkwcqt3vg4r.jpg',
        },
        {
          public_id: 'training-api/cv9eq5gdocvszrrqdhn0',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923418/training-api/cv9eq5gdocvszrrqdhn0.jpg',
        },
        {
          public_id: 'training-api/wbmt4tkpdflrz1e5neup',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923418/training-api/wbmt4tkpdflrz1e5neup.jpg',
        },
        {
          public_id: 'training-api/leatp9upx2xkr1mmiy7r',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923419/training-api/leatp9upx2xkr1mmiy7r.jpg',
        },
        {
          public_id: 'training-api/mv8olzbfxtvlimwwtbkc',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923419/training-api/mv8olzbfxtvlimwwtbkc.jpg',
        },
        {
          public_id: 'training-api/teoxzi0bsjvd0i4kuivi',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923420/training-api/teoxzi0bsjvd0i4kuivi.jpg',
        },
        {
          public_id: 'training-api/gxam64t2oqvssnmdqegk',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1658923420/training-api/gxam64t2oqvssnmdqegk.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-27T12:03:41.171Z',
      updatedAt: '2022-07-28T10:11:11.907Z',
    },
    {
      _id: '62e27895560ba492ee1e219f',
      _org: '62b16906d57e26bc03dd9866',
      name: 'Shoes',
      description:
        '""Reebok celebrates their individuality, their authenticity and the courage it takes to forge their own path to greatness. While some may call them crazy or eccentric, Reebok calls them visionary and original. Commitment to Corporate Responsibility is an important legacy and hallmark of the Reebok brand.""',
      images: [
        {
          public_id: 'training-api/r9p8blxedgjbabqqsmjj',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009170/training-api/r9p8blxedgjbabqqsmjj.jpg',
        },
        {
          public_id: 'training-api/igxibx99kjzyaiwl66fa',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009171/training-api/igxibx99kjzyaiwl66fa.jpg',
        },
        {
          public_id: 'training-api/mymuapamynlyedg0fuk3',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009171/training-api/mymuapamynlyedg0fuk3.jpg',
        },
        {
          public_id: 'training-api/tghkkvlvhgzt5uspvgod',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009172/training-api/tghkkvlvhgzt5uspvgod.jpg',
        },
        {
          public_id: 'training-api/qknhursp0miclywg4t88',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009173/training-api/qknhursp0miclywg4t88.jpg',
        },
        {
          public_id: 'training-api/jxrlhfg8ovtjdmeclqox',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009173/training-api/jxrlhfg8ovtjdmeclqox.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-28T11:52:53.917Z',
      updatedAt: '2022-07-28T11:52:53.917Z',
    },
    {
      _id: '62e278b4560ba492ee1e21a7',
      _org: '62b16906d57e26bc03dd9866',
      name: 'Car',
      description:
        '"A sports car is a car designed with an emphasis on dynamic performance, such as handling, acceleration, top speed, or thrill of driving. Sports cars originated in Europe in the early 1900s and are currently produced by many manufacturers around the world."',
      images: [
        {
          public_id: 'training-api/xz97qbpzc6kisubplfku',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009197/training-api/xz97qbpzc6kisubplfku.jpg',
        },
        {
          public_id: 'training-api/hwdk97equgakbqzboail',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009199/training-api/hwdk97equgakbqzboail.jpg',
        },
        {
          public_id: 'training-api/ruqvyieisch9qbd3nonr',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009199/training-api/ruqvyieisch9qbd3nonr.jpg',
        },
        {
          public_id: 'training-api/ehfashdpmkxgamzevpmn',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009200/training-api/ehfashdpmkxgamzevpmn.jpg',
        },
        {
          public_id: 'training-api/votjonwqspl417ip1soi',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009201/training-api/votjonwqspl417ip1soi.jpg',
        },
        {
          public_id: 'training-api/kecrajgxpev2g4lw4oqk',
          url: 'http://res.cloudinary.com/abs-am/image/upload/v1659009203/training-api/kecrajgxpev2g4lw4oqk.jpg',
        },
      ],
      deleted: false,
      createdAt: '2022-07-28T11:53:24.079Z',
      updatedAt: '2022-07-28T11:53:24.079Z',
    },
  ];
  p: number = 1;
  totalData = { page: 1, limit: 10, totalPages: 1, totalResults: 10 };
  loading: boolean = true;
  empty: boolean = false;
  autoHover = [];

  cartProducts = [];

  constructor(
    private headerTitleService: HeaderTitleService,
    private lstore: LocalStorageService
  ) {
    this.headerTitleService.setTitle('All Products');
  }

  ngOnInit(): void {
    this.loading = false;
    this.cartProducts = this.lstore.getCartData() || [];
    console.log(this.cartProducts);
  }

  pageChanged(event) {
    console.log(event);
    // this.renderProducts(event, this.totalData.limit);
  }

  addToCart(product){
    this.cartProducts.push(product);
    // console.log('cart data:',this.cartProducts);
    this.lstore.setCartData(this.cartProducts);
  }

//   addToCart(product) {
//     Swal.fire({
//       title: '<strong>Select quantity:</strong>',
//       icon: 'info',
//       html:
//         '<div class="btn-group" role="group" aria-label="Basic outlined example">' +
//         ' <button type="button" class="btn btn-outline-primary">-</button>' +
//         ' <button type="button" disabled class="btn btn-outline-primary">Middle</button>' +
//         ' <button type="button" class="btn btn-outline-primary">+</button>' +
//         '</div>',

//       showCloseButton: true,
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Add to cart!',
//     });
//   }
}
