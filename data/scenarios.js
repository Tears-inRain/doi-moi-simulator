const SCENARIOS = [
  {
    id: 1,
    year: 1986,
    title: "Năm 1986 - Đêm trước Đổi mới (Khủng hoảng Lạm phát & Lương thực)",
    context: "Lạm phát chạm mốc kỷ lục 774,7%, đất nước thiếu ăn kinh niên, hàng hóa khan hiếm, bị Mỹ và các nước Tây Âu bao vây cấm vận.",
    problem: "Hội nghị Đại hội VI cần đưa ra định hướng chiến lược nào để cứu nền kinh tế khỏi sự sụp đổ?",
    citation: "Chương III, Mục I - Đại hội VI (12/1986) & Đường lối Đổi mới toàn diện (Giáo trình Lịch sử ĐCSVN)",
    milestone: "Kỷ Nguyên Đổi Mới (Đại hội VI)",
    options: [
      {
        id: "A",
        text: "Tiếp tục duy trì cơ chế kế hoạch hóa tập trung bao cấp, tăng cường kiểm soát giá cả và phân phối hàng hóa qua tem phiếu.",
        isCorrect: false,
        impact: { economyGDP: -25, qualityOfLife: -25, globalStatus: 0, inflationRate: 150 },
        feedback: "SAI LẦM! Duy trì bao cấp sẽ triệt tiêu hoàn toàn động lực sản xuất. Lạm phát sẽ tiếp tục phi mã và khủng hoảng nghiêm trọng hơn."
      },
      {
        id: "B",
        text: '"Nhìn thẳng vào sự thật", xóa bỏ cơ chế tập trung bao cấp, phát triển nền kinh tế hàng hóa nhiều thành phần, tập trung vào Ba chương trình kinh tế lớn (Lương thực - thực phẩm, Hàng tiêu dùng, Hàng xuất khẩu).',
        isCorrect: true,
        impact: { economyGDP: 25, qualityOfLife: 20, globalStatus: 10, inflationRate: -400 },
        feedback: "CHÍNH XÁC! Đây là bước ngoặt lịch sử tại Đại hội VI (12/1986), mở ra kỷ nguyên Đổi mới toàn diện cho Việt Nam."
      },
      {
        id: "C",
        text: "Chỉ tập trung phát triển công nghiệp nặng và vay nợ nước ngoài để duy trì các nhà máy nhà nước.",
        isCorrect: false,
        impact: { economyGDP: -10, qualityOfLife: -15, globalStatus: -5, inflationRate: 50 },
        feedback: "KHÔNG PHÙ HỢP! Việc ưu tiên công nghiệp nặng trong khi nông nghiệp sa sút là nguyên nhân chính gây ra khủng hoảng giai đoạn 1976–1985."
      }
    ]
  },
  {
    id: 2,
    year: 1988,
    title: "Năm 1988 - Giải phóng Sức sản xuất Nông nghiệp (Khoán 10)",
    context: "Sản xuất nông nghiệp đình đốn do mô hình hợp tác xã kiểu cũ. Nông dân không tha thiết với ruộng đất, mỗi năm Nhà nước phải nhập khẩu từ 450.000 đến 1 triệu tấn gạo để cứu đói.",
    problem: "Làm sao để giải quyết dứt điểm nạn thiếu ăn và đưa nông nghiệp phát triển?",
    citation: "Chương III, Mục I - Nghị quyết 10-NQ/TW (4/1988) Bộ Chính trị khóa VI (Giáo trình Lịch sử ĐCSVN)",
    milestone: "Xuất Khẩu Gạo Lịch Sử (Khoán 10)",
    options: [
      {
        id: "A",
        text: "Tăng cường áp đặt chỉ tiêu sản lượng hành chính cho các hợp tác xã và xử phạt nặng các hộ gia đình không hoàn thành kế hoạch.",
        isCorrect: false,
        impact: { economyGDP: -10, qualityOfLife: -20, globalStatus: 0, inflationRate: 20 },
        feedback: "THẤT BẠI! Mệnh lệnh hành chính cứng nhắc không thể thay thế cho lợi ích kinh tế thiết thân của người lao động."
      },
      {
        id: "B",
        text: "Ban hành Nghị quyết 10-NQ/TW (4/1988), công nhận hộ nông dân là đơn vị kinh tế tự chủ, giao quyền sử dụng đất lâu dài và tự do lưu thông nông sản.",
        isCorrect: true,
        impact: { economyGDP: 30, qualityOfLife: 35, globalStatus: 15, inflationRate: -340 },
        feedback: "KỲ TÍCH! Ngay năm 1989, Việt Nam từ chỗ thiếu ăn kinh niên đã vươn lên xuất khẩu đợt đầu 1,4 triệu tấn gạo, đưa lạm phát hạ nhiệt xuống 34,7%."
      },
      {
        id: "C",
        text: "Cho phép nhập khẩu gạo diện rộng và kêu gọi viện trợ lương thực khẩn cấp từ quốc tế.",
        isCorrect: false,
        impact: { economyGDP: -15, qualityOfLife: 5, globalStatus: -10, inflationRate: 0 },
        feedback: "NGẮN HẠN! Đây chỉ là giải pháp tình thế, gây tốn kém ngân sách và không giải quyết được gốc rễ vấn đề sản xuất trong nước."
      }
    ]
  },
  {
    id: 3,
    year: 1995,
    title: "Năm 1995 - Bứt phá Đối ngoại & Phá thế Cấm vận",
    context: "Liên Xô và hệ thống XHCN Đông Âu sụp đổ (1991), Việt Nam mất đi nguồn viện trợ và thị trường truyền thống. Đất nước vẫn đang chịu sự bao vây cấm vận của Mỹ.",
    problem: "Định hướng đối ngoại nào giúp Việt Nam phá vỡ thế bị cô lập?",
    citation: "Chương III, Mục II - Bình thường hóa quan hệ Việt - Mỹ & Gia nhập ASEAN năm 1995 (Giáo trình Lịch sử ĐCSVN)",
    milestone: "Phá Thế Cấm Vận & Gia Nhập ASEAN",
    options: [
      {
        id: "A",
        text: "Đóng cửa nền kinh tế, thực hiện chính sách tự lực cánh sinh tuyệt đối để bảo vệ thị trường trong nước.",
        isCorrect: false,
        impact: { economyGDP: -20, qualityOfLife: -10, globalStatus: -25, inflationRate: 30 },
        feedback: "SAI LẦM! Đóng cửa sẽ khiến đất nước bị tụt hậu xa hơn so với sự phát triển nhanh chóng của khu vực và thế giới."
      },
      {
        id: "B",
        text: "Đẩy mạnh đường lối đối ngoại độc lập, tự chủ, đa phương hóa, đa dạng hóa: Bình thường hóa quan hệ ngoại giao với Hoa Kỳ (11/7/1995) và gia nhập ASEAN (28/7/1995).",
        isCorrect: true,
        impact: { economyGDP: 25, qualityOfLife: 20, globalStatus: 40, inflationRate: -25 },
        feedback: "XUẤT SẮC! Việt Nam chính thức phá bỏ hoàn toàn thế bị bao vây cấm vận, đưa lạm phát về mức an toàn một chữ số (9.7%)."
      },
      {
        id: "C",
        text: "Chỉ thiết lập quan hệ thương mại với các nước trong khu vực Đông Nam Á, giữ nguyên trạng quan hệ căng thẳng với Mỹ.",
        isCorrect: false,
        impact: { economyGDP: 10, qualityOfLife: 5, globalStatus: 10, inflationRate: 0 },
        feedback: "BỊ GIỚI HẠN! Dù có bước tiến nhưng nếu không bình thường hóa quan hệ với Mỹ thì Việt Nam khó thu hút dòng vốn FDI và công nghệ lớn từ các nước phát triển."
      }
    ]
  },
  {
    id: 4,
    year: 2007,
    title: "Năm 2007 - Hội nhập Kinh tế Toàn cầu (Gia nhập WTO)",
    context: "Nền kinh tế Việt Nam sau 20 năm Đổi mới đã có bước phát triển, nhưng cần thị trường xuất khẩu rộng lớn hơn và sức hút đầu tư nước ngoài (FDI) để bứt phá.",
    problem: "Việt Nam có nên chấp nhận các cam kết mở cửa thị trường sâu rộng để gia nhập Tổ chức Thương mại Thế giới (WTO)?",
    citation: "Chương III, Mục II - Kết nạp Việt Nam vào WTO (11/1/2007) thành viên thứ 150 (Giáo trình Lịch sử ĐCSVN)",
    milestone: "Thành Viên Thứ 150 WTO",
    options: [
      {
        id: "A",
        text: "Trì hoãn việc gia nhập WTO vì lo ngại các doanh nghiệp nội địa còn yếu kém sẽ bị thâu tóm bởi tập đoàn nước ngoài.",
        isCorrect: false,
        impact: { economyGDP: -10, qualityOfLife: -5, globalStatus: -15, inflationRate: 0 },
        feedback: "BỎ LỠ THỜI CƠ! Bảo hộ quá đà sẽ làm giảm sức cạnh tranh của nền kinh tế và bỏ lỡ làn sóng đầu tư toàn cầu."
      },
      {
        id: "B",
        text: "Chính thức gia nhập WTO (11/1/2007), chấp nhận luật chơi toàn cầu, chủ động hoàn thiện thể chế kinh tế thị trường định hướng XHCN.",
        isCorrect: true,
        impact: { economyGDP: 35, qualityOfLife: 20, globalStatus: 30, inflationRate: 3 },
        feedback: "KẾT QUẢ RỰC RỠ! Gia nhập WTO tạo cú hích giúp kim ngạch xuất nhập khẩu và FDI tăng vọt. Đến năm 2008, Việt Nam chính thức thoát khỏi nhóm nước nghèo."
      },
      {
        id: "C",
        text: "Gia nhập WTO nhưng đơn phương giữ lại các hàng rào thuế quan bảo hộ cao đối với hầu hết các ngành hàng.",
        isCorrect: false,
        impact: { economyGDP: 0, qualityOfLife: 0, globalStatus: -10, inflationRate: 0 },
        feedback: "KHÔNG THỂ THỰC HIỆN! Các điều khoản của WTO bắt buộc các quốc gia thành viên phải tuân thủ lộ trình cắt giảm thuế quan và mở cửa minh bạch."
      }
    ]
  },
  {
    id: 5,
    year: 2011,
    title: "Năm 2011 - Chuyển đổi Mô hình Tăng trưởng & 3 Đột phá Chiến lược",
    context: "Nền kinh tế chịu tác động của khủng hoảng tài chính toàn cầu (2008). Mô hình tăng trưởng cũ dựa vào khai thác tài nguyên và lao động giá rẻ bắt đầu chạm trần.",
    problem: "Đại hội XI cần đề ra chiến lược gì để đưa Việt Nam phát triển bền vững trong thập kỷ mới?",
    citation: "Chương III, Mục III - Đại hội XI (1/2011) & Chiến lược phát triển kinh tế - xã hội 2011-2020 (Giáo trình Lịch sử ĐCSVN)",
    milestone: "3 Đột Phá Chiến Lược (Đại hội XI)",
    options: [
      {
        id: "A",
        text: "Thông qua Chiến lược phát triển kinh tế 2011–2020 với 3 Đột phá chiến lược: (1) Hoàn thiện thể chế kinh tế thị trường, (2) Phát triển nguồn nhân lực chất lượng cao, (3) Xây dựng kết cấu hạ tầng đồng bộ.",
        isCorrect: true,
        impact: { economyGDP: 25, qualityOfLife: 20, globalStatus: 20, inflationRate: -8 },
        feedback: "TẦM NHÌN XA! 3 đột phá chiến lược đã trở thành kim chỉ nam tái cơ cấu nền kinh tế, nâng cao năng suất và giữ vững lạm phát an toàn (4.7%)."
      },
      {
        id: "B",
        text: "Tiếp tục mở rộng các tập đoàn kinh tế nhà nước (SBICs/Vinashin...) và kích cầu bằng cách bơm tiền ra thị trường.",
        isCorrect: false,
        impact: { economyGDP: -15, qualityOfLife: -10, globalStatus: -10, inflationRate: 80 },
        feedback: "NGUY HIỂM! Việc đầu tư dàn trải của các tập đoàn nhà nước thiếu hiệu quả và bơm tiền tràn lan sẽ làm lạm phát tái bùng phát (như năm 2011 lạm phát từng vọt lên 18,13%)."
      },
      {
        id: "C",
        text: "Tập trung toàn bộ nguồn lực vào việc phát triển các khu công nghiệp gia công lắp ráp ngắn hạn.",
        isCorrect: false,
        impact: { economyGDP: 10, qualityOfLife: 5, globalStatus: 5, inflationRate: 0 },
        feedback: "BẪY THU NHẬP TRUNG BÌNH! Chỉ tập trung gia công thô sẽ khiến Việt Nam mắc kẹt ở giá trị gia tăng thấp và ô nhiễm môi trường."
      }
    ]
  },
  {
    id: 6,
    year: 2016,
    title: "Năm 2016 - Đẩy mạnh Phòng, Chống Tham nhũng & Chỉnh đốn Đảng",
    context: "Mặt trái của kinh tế thị trường bộc lộ. Tình trạng tham nhũng, lãng phí, 'nhóm lợi ích' và suy thoái tư tưởng chính trị, đạo đức trong một bộ phận cán bộ diễn biến phức tạp, làm giảm sút niềm tin của nhân dân.",
    problem: "Đảng cần hành động như thế nào để giữ vững bản chất cách mạng và niềm tin của nhân dân?",
    citation: "Chương III, Mục III - Đại hội XII (2016) & Nghị quyết Trung ương 4 khóa XII (Giáo trình Lịch sử ĐCSVN)",
    milestone: "Chỉnh Đốn Đảng & Xiết Chặt Kỷ Cương",
    options: [
      {
        id: "A",
        text: "Nể hại, che giấu các khuyết điểm của cán bộ cấp cao để giữ uy tín hình ảnh nội bộ.",
        isCorrect: false,
        impact: { economyGDP: -10, qualityOfLife: -25, globalStatus: -15, inflationRate: 0 },
        feedback: "TÁC HẠI TỒI TỆ! Dung túng cho tham nhũng sẽ làm suy yếu bộ máy nhà nước, gây thất thoát tài sản quốc gia và xói mòn nghiêm trọng lòng tin của dân."
      },
      {
        id: "B",
        text: 'Ban hành Nghị quyết TW 4 (Khóa XII), đẩy mạnh công tác xây dựng, chỉnh đốn Đảng với phương châm "Không có vùng cấm, không có ngoại lệ, bất kể người đó là ai".',
        isCorrect: true,
        impact: { economyGDP: 15, qualityOfLife: 30, globalStatus: 25, inflationRate: -1.5 },
        feedback: "QUYẾT TÂM CHÍNH TRỊ CAO! Việc xử lý nghiêm minh hàng loạt vụ án kinh tế - tham nhũng lớn đã giúp siết chặt kỷ cương, củng cố niềm tin yêu của nhân dân đối với sự lãnh đạo của Đảng."
      },
      {
        id: "C",
        text: "Chỉ xử lý các vụ việc nhỏ ở cấp cơ sở để mang tính răn đe nhẹ nhàng.",
        isCorrect: false,
        impact: { economyGDP: -5, qualityOfLife: -10, globalStatus: -5, inflationRate: 0 },
        feedback: 'KHÔNG HIỆU QUẢ! "Tắm từ đầu xuống", nếu không xử lý nghiêm các vụ án lớn thì không thể triệt phá được các lợi ích nhóm phức tạp.'
      }
    ]
  },
  {
    id: 7,
    year: 2021,
    title: "Năm 2021 - Nhìn lại 35 năm Đổi mới & Khát vọng 2045",
    context: "Đại hội XIII của Đảng diễn ra trong bối cảnh thế giới biến động phức tạp và đại dịch COVID-19 bùng nổ. Việt Nam đã trải qua 35 năm tiến hành công cuộc Đổi mới (1986–2021).",
    problem: "Đại hội XIII tổng kết 35 năm Đổi mới và vạch ra mục tiêu phát triển đất nước đến giữa thế kỷ XXI như thế nào?",
    citation: "Chương III, Mục III - Đại hội XIII (1/2021) & Tầm nhìn phát triển đất nước đến 2030, 2045 (Giáo trình Lịch sử ĐCSVN)",
    milestone: "Cơ Đồ & Khát Vọng Phát Triển 2045",
    options: [
      {
        id: "A",
        text: 'Khẳng định "Đất nước ta chưa bao giờ có được cơ đồ, tiềm lực, vị thế và uy tín quốc tế như ngày nay". Đặt mục tiêu đến năm 2030 là nước đang phát triển có công nghiệp hiện đại, thu nhập trung bình cao; đến năm 2045 trở thành nước phát triển, thu nhập cao.',
        isCorrect: true,
        impact: { economyGDP: 30, qualityOfLife: 30, globalStatus: 35, inflationRate: -0.4 },
        feedback: "ĐẦY HÀO HÙNG! Đánh giá trúng thành tựu lịch sử, khơi dậy khát vọng phát triển đất nước phồn vinh, hạnh phúc và củng cố con đường đi lên CNXH."
      },
      {
        id: "B",
        text: "Đánh giá rằng 35 năm Đổi mới chưa mang lại thay đổi đáng kể và đề xuất quay lại mô hình quản lý tập trung hóa.",
        isCorrect: false,
        impact: { economyGDP: -30, qualityOfLife: -30, globalStatus: -30, inflationRate: 50 },
        feedback: "PHỦ NHẬN THỰC TIỄN! Đánh giá này đi ngược lại hoàn toàn với những thành tựu to lớn mà toàn Đảng, toàn dân ta đã nỗ lực giành được."
      },
      {
        id: "C",
        text: "Hài lòng với những gì đã đạt được, không đặt ra các mục tiêu cao hơn cho mốc 2030 và 2045.",
        isCorrect: false,
        impact: { economyGDP: 0, qualityOfLife: 0, globalStatus: -10, inflationRate: 0 },
        feedback: "THIẾU Ý CHÍ! Trong một thế giới cạnh tranh gay gắt, không tiến lên tức là lùi bước."
      }
    ]
  }
];

module.exports = SCENARIOS;
