const menu = [
  {
    id: 1,
    title: 'อาหารเช้า',
    category: 'breakfast',
    price: 50,
    img: '/pic/breakfast.jpg',
    desc: 'แพนเค้กหนานุ่ม ราดน้ำผึ้งฉ่ำๆ เสิร์ฟพร้อมผลไม้สด',
    // 🟢 เติม options เข้ามาเพื่อให้หน้า FoodDetail แสดง Checkbox
    options: [
      { label: 'เพิ่มไข่ดาว', price: 10 },
      { label: 'เพิ่มไส้กรอก', price: 15 },
      { label: 'ไม่รับผัก', price: 0 }
    ]
  },
  {
    id: 2,
    title: 'Diner Double Burger',
    category: 'dim sum',
    price: 13.99,
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    desc: 'เบอร์เกอร์เนื้อวากิวสองชั้น ชีสเยิ้มๆ พร้อมเฟรนช์ฟรายส์',
  },
  {
    id: 3,
    title: 'Steak & Salad',
    category: 'drinks',
    price: 25.99,
    img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80',
    desc: 'สเต็กเนื้อสันในย่างสุกกำลังดี เสิร์ฟพร้อมสลัดผักออร์แกนิก',
     options: [
      { label: 'หวานน้อย', price: 0 },
      { label: 'หวานปกติ', price: 0 },
      { label: 'หวานมาก', price: 0 }
    ]
  },
  {
    id: 4,
    title: 'Oreo Dream',
    category: 'coffee',
    price: 8.99,
    img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80',
    desc: 'ของหวานโอรีโอ้ปั่นเข้มข้น ท็อปด้วยวิปครีมพูนๆ',
  },
  {
    id: 5,
    title: 'Eggs Benedict',
    category: 'special',
    price: 12.99,
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
    desc: 'ไข่เบเนดิกต์กับแฮมและซอสฮอลแลนเดสเข้มข้น',
  }
];

export default menu;