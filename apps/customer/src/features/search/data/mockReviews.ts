import type { Review } from '@repo/types';

// Map với customers trong localStorage:
// cust-1: Nguyễn Văn An (main customer)
// cust-2: Trần Thị Bình  
// cust-3: Lê Văn Cường
// cust-4: Phạm Thị Dung
// cust-5: Hoàng Văn Em

export const phoHaNoiReviews: Review[] = [
  {
    id: "phn-1",
    customerId: "cust-1",
    authorName: "Nguyễn Văn An",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "2 ngày trước",
    content: "Phở ở đây ngon tuyệt vời! Nước dùng trong, thanh ngọt đúng chuẩn vị Bắc. Mình rất thích quẩy ở đây, giòn tan.",
    tenure: "Thành viên 2 năm",
    location: "TP.HCM"
  },
  {
    id: "phn-2",
    customerId: "cust-2",
    authorName: "Trần Thị Bình",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    date: "1 tuần trước",
    content: "Quán sạch sẽ, nhân viên phục vụ nhanh nhẹn. Tuy nhiên vào giờ cao điểm hơi đông và ồn ào một chút.",
    tenure: "Thành viên mới",
    location: "TP.HCM"
  },
  {
    id: "phn-3",
    customerId: "cust-3",
    authorName: "Lê Văn Cường",
    authorAvatar: "https://i.pravatar.cc/150?img=7",
    rating: 5,
    date: "2 tuần trước",
    content: "Mình ăn phở ở đây từ hồi quán mới mở. Chất lượng vẫn giữ vững phong độ. Bò tái lăn rất ngon!",
    tenure: "Local Guide",
    location: "Quận 1"
  },
  {
    id: "phn-4",
    customerId: "cust-4",
    authorName: "Phạm Thị Dung",
    authorAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    date: "3 tuần trước",
    content: "Vị phở làm mình nhớ Hà Nội quá. Sẽ ghé lại thường xuyên.",
    tenure: "Thành viên 6 tháng"
  },
  {
    id: "phn-5",
    customerId: "cust-5",
    authorName: "Hoàng Văn Em",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    date: "1 tháng trước",
    content: "Phở ở đây ngon lắm, giá cả hợp lý. Mình sẽ giới thiệu cho bạn bè.",
    tenure: "Thành viên thường",
    location: "TP.HCM"
  }
];

export const sushiSakuraReviews: Review[] = [
  {
    id: "ss-1",
    customerId: "cust-4",
    authorName: "Phạm Thị Dung",
    authorAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    date: "1 ngày trước",
    content: "Sashimi tươi rói, cắt lát dày dặn ăn rất đã miệng. Không gian quán ấm cúng, đậm chất Nhật Bản.",
    tenure: "Thành viên Vàng",
    location: "TP.HCM"
  },
  {
    id: "ss-2",
    customerId: "cust-1",
    authorName: "Nguyễn Văn An",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "3 ngày trước",
    content: "Sushi cuộn chắc tay, cơm dẻo. Mình thích nhất là món lươn nướng Nhật.",
    tenure: "Thành viên 1 năm"
  },
  {
    id: "ss-3",
    customerId: "cust-5",
    authorName: "Hoàng Văn Em",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    rating: 4,
    date: "1 tuần trước",
    content: "Đồ ăn ngon nhưng giá hơi cao so với mặt bằng chung. Đáng để thử vào dịp đặc biệt.",
    tenure: "Food Blogger",
    location: "District 3"
  },
  {
    id: "ss-4",
    customerId: "cust-2",
    authorName: "Trần Thị Bình",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    date: "2 tuần trước",
    content: "Nhân viên rất lịch sự, cúi chào khách nhiệt tình. Món ăn trang trí đẹp mắt, check-in sống ảo cực chất.",
    tenure: "Instagrammer"
  },
  {
    id: "ss-5",
    customerId: "cust-3",
    authorName: "Lê Văn Cường",
    authorAvatar: "https://i.pravatar.cc/150?img=7",
    rating: 5,
    date: "1 tháng trước",
    content: "Sushi ngon, tươi. Không gian đẹp, view thoáng. Rất recommend!",
    tenure: "Expat",
    location: "District 2"
  },
  {
    id: "ss-6",
    customerId: "cust-4",
    authorName: "Phạm Thị Dung",
    authorAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 4.5,
    date: "1 tháng trước",
    content: "Tempura giòn rụm, không bị ngấm dầu. Sẽ quay lại thử các món lẩu.",
    tenure: "Thành viên mới"
  }
];

export const pizzaBellaReviews: Review[] = [
  {
    id: "pb-1",
    customerId: "cust-2",
    authorName: "Trần Thị Bình",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    date: "5 giờ trước",
    content: "Pizza nướng củi thơm phức, đế bánh mỏng giòn đúng kiểu Ý. Phô mai Mozzarella béo ngậy.",
    tenure: "Pizza Lover",
    location: "TP.HCM"
  },
  {
    id: "pb-2",
    customerId: "cust-5",
    authorName: "Hoàng Văn Em",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    rating: 4,
    date: "2 ngày trước",
    content: "Mỳ Ý sốt kem nấm (Carbonara) rất ngon, kem béo nhưng không ngán. Phục vụ hơi chậm xíu.",
    tenure: "Thành viên 3 tháng"
  },
  {
    id: "pb-3",
    customerId: "cust-1",
    authorName: "Nguyễn Văn An",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "1 tuần trước",
    content: "Pizza Margherita ở đây ngon nhất Sài Gòn! Sẽ quay lại nhé.",
    tenure: "Expat",
    location: "District 7"
  },
  {
    id: "pb-4",
    customerId: "cust-3",
    authorName: "Lê Văn Cường",
    authorAvatar: "https://i.pravatar.cc/150?img=7",
    rating: 5,
    date: "3 tuần trước",
    content: "Không gian lãng mạn, thích hợp hẹn hò. Rượu vang quán chọn kèm cũng rất hợp vị.",
    tenure: "Thành viên Vàng"
  }
];

export const bunBoHueReviews: Review[] = [
  {
    id: "bbh-1",
    customerId: "cust-4",
    authorName: "Phạm Thị Dung",
    authorAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    date: "Hôm qua",
    content: "Nước lèo đậm đà, mắm ruốc thơm lừng nhưng không bị nồng. Giò heo to, thịt mềm.",
    tenure: "Thành viên lâu năm",
    location: "Miền Trung"
  },
  {
    id: "bbh-2",
    customerId: "cust-1",
    authorName: "Nguyễn Văn An",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "3 ngày trước",
    content: "Sa tế cay xè lưỡi nhưng ăn rất đã. Rau sống tươi sạch. 10 điểm!",
    tenure: "Thành viên VIP"
  },
  {
    id: "bbh-3",
    customerId: "cust-2",
    authorName: "Trần Thị Bình",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    date: "1 tuần trước",
    content: "Bún ngon, rau thơm. Nước lèo đậm đà hơi cay một chút.",
    tenure: "Tourist",
    location: "Australia"
  },
  {
    id: "bbh-4",
    customerId: "cust-5",
    authorName: "Hoàng Văn Em",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    date: "2 tuần trước",
    content: "Quán bình dân nhưng chất lượng tuyệt vời. Bún sợi to đúng chuẩn Huế.",
    tenure: "Local Guide"
  }
];

export const cafeDeParisReviews: Review[] = [
  {
    id: "cdp-1",
    customerId: "cust-2",
    authorName: "Trần Thị Bình",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    date: "Sáng nay",
    content: "Croissant ở đây là đỉnh nhất Sài Gòn! Thơm mùi bơ Pháp, lớp vỏ ngàn lớp giòn tan.",
    tenure: "Thành viên Vàng",
    location: "Paris Lover"
  },
  {
    id: "cdp-2",
    customerId: "cust-4",
    authorName: "Phạm Thị Dung",
    authorAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    date: "2 ngày trước",
    content: "Cafe đẹp lắm, latte art cũng xinh. Macaron ngon tuyệt!",
    tenure: "Influencer"
  },
  {
    id: "cdp-3",
    customerId: "cust-3",
    authorName: "Lê Văn Cường",
    authorAvatar: "https://i.pravatar.cc/150?img=7",
    rating: 4,
    date: "1 tuần trước",
    content: "Không gian sang trọng, nhạc du dương. Giá hơi chát nhưng xứng đáng trải nghiệm.",
    tenure: "MC"
  },
  {
    id: "cdp-4",
    customerId: "cust-1",
    authorName: "Nguyễn Văn An",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "1 tuần trước",
    content: "Bánh ngọt ở đây siêu ngon. View sống ảo cũng đẹp nữa.",
    tenure: "Singer"
  }
];

export const kbbqReviews: Review[] = [
  {
    id: "kbbq-1",
    customerId: "cust-1",
    authorName: "Nguyễn Văn An",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "Hôm qua",
    content: "Thịt bò nướng mềm, tẩm ướp đậm đà. Panchan (món phụ) siêu nhiều và được refill thoải mái.",
    tenure: "Korean Food Fan",
    location: "District 7"
  },
  {
    id: "kbbq-2",
    customerId: "cust-4",
    authorName: "Phạm Thị Dung",
    authorAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    date: "4 ngày trước",
    content: "Nướng tại bàn rất vui. Nhân viên nướng giúp mình nên không lo bị cháy. Kimchi canh ngon tuyệt.",
    tenure: "Thành viên Vàng"
  },
  {
    id: "kbbq-3",
    customerId: "cust-5",
    authorName: "Hoàng Văn Em",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    rating: 4,
    date: "2 tuần trước",
    content: "Buffet nhiều món, ăn no căng bụng. Nên đặt bàn trước vì quán rất đông.",
    tenure: "Thành viên mới"
  },
  {
    id: "kbbq-4",
    customerId: "cust-2",
    authorName: "Trần Thị Bình",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    date: "3 tuần trước",
    content: "Thịt ba chỉ nướng giòn ăn kèm lá mè và tỏi nướng là hết sẩy!",
    tenure: "Actress"
  }
];

export const thaiSpiceReviews: Review[] = [
  {
    id: "ts-1",
    customerId: "cust-5",
    authorName: "Hoàng Văn Em",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    date: "2 ngày trước",
    content: "Lẩu Thái Tomyum chua cay đúng vị, hải sản tươi. Xôi xoài tráng miệng rất ngon.",
    tenure: "Thành viên 2 năm"
  },
  {
    id: "ts-2",
    customerId: "cust-3",
    authorName: "Lê Văn Cường",
    authorAvatar: "https://i.pravatar.cc/150?img=7",
    rating: 4,
    date: "5 ngày trước",
    content: "Pad Thái hơi ngọt so với khẩu vị mình nhưng vẫn ngon. Trà sữa Thái đỏ đậm đà.",
    tenure: "Thành viên 1 năm"
  },
  {
    id: "ts-3",
    customerId: "cust-1",
    authorName: "Nguyễn Văn An",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "2 tuần trước",
    content: "Món Thái ở đây authentic lắm. Green curry cay và béo, rất ngon!",
    tenure: "Expat"
  }
];

export const burgerBrosReviews: Review[] = [
  {
    id: "bb-1",
    customerId: "cust-5",
    authorName: "Hoàng Văn Em",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    date: "Hôm nay",
    content: "Bò nướng than thơm lừng, juicy mọng nước. Bánh mì brioche mềm mịn. Burger ngon nhất khu vực!",
    tenure: "Burger Hunter",
    location: "District 10"
  },
  {
    id: "bb-2",
    customerId: "cust-2",
    authorName: "Trần Thị Bình",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    date: "3 ngày trước",
    content: "Khoai tây chiên giòn, sốt chấm lạ miệng. Burger hơi to nên ăn khó hết.",
    tenure: "Thành viên mới"
  },
  {
    id: "bb-3",
    customerId: "cust-4",
    authorName: "Phạm Thị Dung",
    authorAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    date: "1 tháng trước",
    content: "Double cheeseburger siêu to, siêu ngon. Giá hợp lý!",
    tenure: "Legend"
  }
];

export const dimSumReviews: Review[] = [
  {
    id: "ds-1",
    customerId: "cust-1",
    authorName: "Nguyễn Văn An",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "Cuối tuần trước",
    content: "Há cảo tôm tươi, vỏ mỏng dai. Chân gà hấp tàu xì mềm rục, thấm vị. Trà hoa cúc thơm.",
    tenure: "Chinese Cuisine Fan"
  },
  {
    id: "ds-2",
    customerId: "cust-3",
    authorName: "Lê Văn Cường",
    authorAvatar: "https://i.pravatar.cc/150?img=7",
    rating: 5,
    date: "2 tuần trước",
    content: "Không gian đậm chất Trung Hoa. Phục vụ nhanh, đồ ăn nóng hổi.",
    tenure: "Thành viên lâu năm"
  },
  {
    id: "ds-3",
    customerId: "cust-4",
    authorName: "Phạm Thị Dung",
    authorAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 4,
    date: "3 tuần trước",
    content: "Dimsum ngon, giá ok. Bao buns mềm và ngọt.",
    tenure: "Tourist"
  }
];

export const medReviews: Review[] = [
  {
    id: "md-1",
    customerId: "cust-1",
    authorName: "Nguyễn Văn An",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "Hôm qua",
    content: "Món ăn healthy, nhiều rau củ tươi. Hummus và bánh Pita là sự kết hợp hoàn hảo.",
    tenure: "Model",
    location: "Desino"
  },
  {
    id: "md-2",
    customerId: "cust-5",
    authorName: "Hoàng Văn Em",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    date: "1 tuần trước",
    content: "Nguyên liệu tươi, màu sắc rực rỡ. Sườn cừu nướng chín vừa tuyệt!",
    tenure: "Chef Wannabe"
  },
  {
    id: "md-3",
    customerId: "cust-2",
    authorName: "Trần Thị Bình",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    date: "2 tuần trước",
    content: "Không gian thoáng đãng, decor đẹp. Salad Hy Lạp rất tươi ngon.",
    tenure: "Thành viên Vàng"
  }
];
