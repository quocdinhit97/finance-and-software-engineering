import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ContinueReading from '@site/src/components/ContinueReading';

interface Part {
  numeral: string;
  title: string;
  question: string;
  to: string;
  chapters: string[];
}

function useParts(): Part[] {
  return [
    {
      numeral: 'I',
      title: translate({id: 'home.part1.title', message: 'Nền tảng'}),
      question: translate({id: 'home.part1.q', message: 'Tại sao tín dụng vận hành như vậy?'}),
      to: '/docs/foundations',
      chapters: [
        translate({id: 'home.ch1', message: '1. Kinh tế học của tín dụng tiêu dùng'}),
        translate({id: 'home.ch2', message: '2. Toán học của tín dụng'}),
      ],
    },
    {
      numeral: 'II',
      title: translate({id: 'home.part2.title', message: 'Sản phẩm'}),
      question: translate({id: 'home.part2.q', message: 'Một sản phẩm cho vay được cấu thành từ những gì?'}),
      to: '/docs/products',
      chapters: [
        translate({id: 'home.ch3', message: '3. Thiết kế sản phẩm tài chính'}),
        translate({id: 'home.ch4', message: '4. Hành trình khách hàng'}),
        translate({id: 'home.ch5', message: '5. Mô hình doanh thu và quản lý danh mục'}),
      ],
    },
    {
      numeral: 'III',
      title: translate({id: 'home.part3.title', message: 'Hệ thống'}),
      question: translate({id: 'home.part3.q', message: 'Nghiệp vụ được hiện thực hóa thành phần mềm ra sao?'}),
      to: '/docs/system',
      chapters: [
        translate({id: 'home.ch6', message: '6. Kiến trúc hệ thống tài chính'}),
        translate({id: 'home.ch7', message: '7. Quy trình khởi tạo khoản vay'}),
        translate({id: 'home.ch8', message: '8. Quản lý tài khoản và billing engine'}),
        translate({id: 'home.ch9', message: '9. Chu kỳ thanh toán'}),
        translate({id: 'home.ch10', message: '10. Quản lý nợ và thu hồi'}),
      ],
    },
    {
      numeral: 'IV',
      title: translate({id: 'home.part4.title', message: 'Trí tuệ'}),
      question: translate({id: 'home.part4.q', message: 'Cho ai vay, với giá nào, và có trách nhiệm ra sao?'}),
      to: '/docs/intelligence',
      chapters: [
        translate({id: 'home.ch11', message: '11. Credit scoring'}),
        translate({id: 'home.ch12', message: '12. Định giá dựa trên rủi ro'}),
        translate({id: 'home.ch13', message: '13. Kinh tế học hành vi và tài chính có trách nhiệm'}),
      ],
    },
    {
      numeral: 'V',
      title: translate({id: 'home.part5.title', message: 'Tương lai'}),
      question: translate({id: 'home.part5.q', message: 'Điều gì thay đổi và điều gì còn mãi?'}),
      to: '/docs/future',
      chapters: [
        translate({id: 'home.ch14', message: '14. BNPL và embedded finance'}),
        translate({id: 'home.ch15', message: '15. AI và tương lai của tín dụng'}),
        translate({id: 'home.ch16', message: '16. Những nguyên tắc thiết kế bất biến'}),
      ],
    },
  ];
}

export default function Home(): ReactNode {
  const parts = useParts();
  return (
    <Layout
      title={translate({id: 'home.metaTitle', message: 'Kiến trúc tín dụng'})}
      description={translate({id: 'home.metaDescription', message: 'Một cuốn sách về hệ thống tài chính tiêu dùng: từ kinh tế học, toán tài chính đến kiến trúc phần mềm và mã nguồn production.'})}>
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}><Translate id="home.eyebrow">Sách điện tử chuyên ngành</Translate></p>
          <h1 className={styles.title}><Translate id="home.title">Kiến trúc tín dụng</Translate></h1>
          <p className={styles.subtitle}>
            <Translate id="home.subtitle">Hệ thống tài chính tiêu dùng: từ kinh tế học đến mã nguồn</Translate>
          </p>
          <p className={styles.lede}>
            <Translate id="home.lede">
              Cuốn sách theo chân một khoản vay tiêu dùng từ lúc khách hàng nộp hồ sơ đến khi tất toán, và giải thích mọi thứ phía sau nó: vì sao lãi suất được định như vậy, số tiền trả mỗi tháng được tính ra sao, và vì sao một nền tảng cho vay cần những quyết định kiến trúc mà hệ thống doanh nghiệp thông thường không cần.
            </Translate>
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/docs/introduction/preface">
              <Translate id="home.ctaRead">Bắt đầu đọc</Translate>
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/table-of-contents">
              <Translate id="home.ctaToc">Mở mục lục</Translate>
            </Link>
          </div>
          <ContinueReading />
        </header>

        <div className={styles.imageWrapper}>
          <img 
            src={useBaseUrl('/img/introduce.png')} 
            alt={translate({id: 'home.image.alt', message: 'Kiến thức tài chính và công nghệ tài chính'})}
            loading="lazy"
          />
        </div>


        <section className={styles.section}>
          <h2><Translate id="home.bridge.title">Ba thế giới, một khoản vay</Translate></h2>
          <p className={styles.bridge}>
            <span><Translate id="home.bridge.finance">Tài chính</Translate></span>
            <span aria-hidden="true">→</span>
            <span><Translate id="home.bridge.business">Logic nghiệp vụ</Translate></span>
            <span aria-hidden="true">→</span>
            <span><Translate id="home.bridge.software">Kỹ thuật phần mềm</Translate></span>
          </p>
          <p>
            <Translate id="home.bridge.body">
              Chị Lan vay 18,500,000 VNĐ trong 12 tháng với lãi suất danh nghĩa 18%/năm. Từ khoản vay đó, cuốn sách lần lượt giải thích thông tin bất cân xứng, công thức niên kim, bảng khấu hao, chi phí tín dụng thực tế, chu kỳ billing cuối tháng, xử lý quá hạn, chấm điểm tín dụng và cách tất cả những điều đó trở thành entity, transaction, event và batch job trong một nền tảng có hơn hai mươi module.
            </Translate>
          </p>
        </section>

        <section className={styles.section}>
          <h2><Translate id="home.audience.title">Dành cho ai</Translate></h2>
          <dl className={styles.audience}>
            <dt><Translate id="home.aud.dev">Developer và software architect</Translate></dt>
            <dd><Translate id="home.aud.dev.d">Hiểu vì sao hệ thống tài chính trông phức tạp, và phần lớn sự phức tạp đó đến từ ràng buộc kinh tế và pháp lý chứ không phải over-engineering.</Translate></dd>
            <dt><Translate id="home.aud.ba">Business analyst, product owner, product manager</Translate></dt>
            <dd><Translate id="home.aud.ba.d">Có đủ ngôn ngữ tài chính để làm việc với stakeholder và đủ hiểu biết kỹ thuật để viết requirement không bị hiện thực hóa sai.</Translate></dd>
            <dt><Translate id="home.aud.fin">Người làm tài chính chưa quen công nghệ</Translate></dt>
            <dd><Translate id="home.aud.fin.d">Thấy được nghiệp vụ quen thuộc được chuyển thành dữ liệu, quy trình và quyết định kiến trúc như thế nào.</Translate></dd>
            <dt><Translate id="home.aud.new">Người mới vào ngành</Translate></dt>
            <dd><Translate id="home.aud.new.d">Một tấm bản đồ tổng thể để biết mình đang đứng ở đâu và cần học gì tiếp theo.</Translate></dd>
          </dl>
        </section>

        <section className={styles.section}>
          <h2><Translate id="home.parts.title">Cấu trúc cuốn sách</Translate></h2>
          <ol className={styles.parts}>
            {parts.map((p) => (
              <li key={p.numeral} className={styles.part}>
                <div className={styles.numeral}>{p.numeral}</div>
                <div>
                  <h3><Link to={p.to}>{p.title}</Link></h3>
                  <p className={styles.question}>{p.question}</p>
                  <ul className={styles.chapters}>
                    {p.chapters.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <h2><Translate id="home.journey.title">Hai cách đọc</Translate></h2>
          <p>
            <Translate id="home.journey.read">
              Đọc tuần tự từ Lời mở đầu đến Chương 16 nếu bạn muốn đi từ kiến thức nền tảng đến các bài toán production. Mỗi chương có ba lớp: khái niệm, cơ chế và hiện thực hóa. Người không lập trình có thể chỉ đọc lớp khái niệm mà vẫn nắm được bức tranh hoàn chỉnh.
            </Translate>
          </p>
          <p>
            <Translate id="home.journey.ref">
              Hoặc dùng sách như tài liệu tra cứu: thuật ngữ, phụ lục công thức, kiến trúc tham chiếu và các công cụ tính lịch trả nợ, chi phí tín dụng.
            </Translate>
          </p>
          <p className={styles.links}>
            <Link to="/docs/introduction/how-to-read"><Translate id="home.link.how">Cách đọc cuốn sách</Translate></Link>
            <Link to="/docs/glossary"><Translate id="home.link.glossary">Thuật ngữ</Translate></Link>
            <Link to="/docs/appendices/c-math-reference"><Translate id="home.link.math">Công thức</Translate></Link>
            <Link to="/docs/tools"><Translate id="home.link.tools">Công cụ tính</Translate></Link>
          </p>
        </section>
      </main>
    </Layout>
  );
}
