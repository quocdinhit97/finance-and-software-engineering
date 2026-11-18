import {translate} from '@docusaurus/Translate';

export const useLoanLabels = () => ({
  principal: translate({id: 'loan.principal', message: 'Gốc'}),
  interest: translate({id: 'loan.interest', message: 'Lãi'}),
  balance: translate({id: 'loan.balance', message: 'Dư nợ gốc cuối kỳ'}),
  period: translate({id: 'loan.period', message: 'Kỳ'}),
  opening: translate({id: 'loan.opening', message: 'Dư nợ đầu kỳ'}),
  payment: translate({id: 'loan.payment', message: 'Số tiền trả'}),
  closing: translate({id: 'loan.closing', message: 'Dư nợ cuối kỳ'}),
});
