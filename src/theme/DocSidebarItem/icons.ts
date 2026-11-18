import type {LucideIcon} from 'lucide-react';
import {
  BookA, BookOpenText, Bot, Boxes, Brain, CalendarClock, Calculator, Compass, Feather, FilePen, Gauge,
  HandCoins, Info, Landmark, ListTree, Network, Package, Paperclip, PieChart, Route, Scale, Server,
  ShieldCheck, Shapes, ShoppingCart, Sigma, SquareFunction, Tags, Wallet, BrainCircuit, Rocket, FileText,
} from 'lucide-react';

/** Sidebar icon per doc id (without locale). Unknown ids fall back to FileText. */
const BY_DOC_ID: Record<string, LucideIcon> = {
  'table-of-contents': ListTree,
  'introduction/preface': Feather,
  'introduction/how-to-read': BookOpenText,
  'introduction/about': Info,
  'foundations/index': Landmark,
  'foundations/ch01-credit-economics': Scale,
  'foundations/ch02-mathematics-of-lending': Sigma,
  'products/index': Package,
  'products/ch03-product-design': Shapes,
  'products/ch04-customer-journey': Route,
  'products/ch05-revenue-portfolio': PieChart,
  'system/index': Server,
  'system/ch06-financial-system-architecture': Network,
  'system/ch07-origination': FilePen,
  'system/ch08-account-management': Wallet,
  'system/ch09-billing-cycle': CalendarClock,
  'system/ch10-collections': HandCoins,
  'intelligence/index': BrainCircuit,
  'intelligence/ch11-credit-scoring': Gauge,
  'intelligence/ch12-risk-based-pricing': Tags,
  'intelligence/ch13-behavioral-economics': Brain,
  'future/index': Rocket,
  'future/ch14-embedded-finance-bnpl': ShoppingCart,
  'future/ch15-ai-future-of-lending': Bot,
  'future/ch16-timeless-principles': Compass,
  'glossary/index': BookA,
  'appendices/index': Paperclip,
  'appendices/a-architecture-reference': Boxes,
  'appendices/c-math-reference': SquareFunction,
  'appendices/d-regulatory-reference': ShieldCheck,
  'tools/index': Calculator,
};

export function iconForDoc(docId: string | undefined): LucideIcon {
  return (docId && BY_DOC_ID[docId]) || FileText;
}
