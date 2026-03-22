const menu = [
  {
    id: 1,
    title: 'อาหารเช้า',
    category: 'breakfast',
    price: 50,
    img: '/pic/breakfast.jpg',
    desc: 'ไข่ดาว ปลาทอด ไส้กรอก แฮม ขนมปังปิ้ง',
    options: [
      { label: 'เพิ่มไข่ดาว', price: 10 },
      { label: 'เพิ่มไส้กรอก', price: 15 },
      { label: 'ไม่รับผัก', price: 0 }
    ]
  },
  {
    id: 2,
    title: 'ขนมจีบหมู',
    category: 'dim sum',
    price: 13,
    img: '/pic/DimSum.jpg',
    desc: 'ขนมจีบหมู',
  },
  {
    id: 3,
    title: 'ชามะนาวเย็น',
    category: 'drinks',
    price: 20,
    img: '/pic/lemontea.jpg',
    desc: 'ชามะนาว',
     options: [
      { label: 'หวานน้อย', price: 0 },
      { label: 'หวานปกติ', price: 0 },
      { label: 'หวานมาก', price: 0 }
    ]
  },
  {
    id: 4,
    title: 'กาแฟร้อน',
    category: 'coffee',
    price: 12,
    img: '/pic/coffee1.jpg',
    desc: 'กาแฟร้อน',
    options: [
      { label: 'หวานน้อย', price: 0 },
      { label: 'หวานปกติ', price: 0 },
      { label: 'หวานมาก', price: 0 }
    ]
  },
  {
    id: 5,
    title: 'ช้าวซอยไก่',
    category: 'special',
    price: 35,
    img: '/pic/Khao Soi.jpg',
    desc: 'ข้าวซอยไก่',
    options: [
      { label: 'เพิ่มไก่', price: 5 },
      { label: 'พิเศษ', price: 20 }
    ]
  }
];

export default menu;