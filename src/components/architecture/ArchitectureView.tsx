import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Server, 
  Database, 
  Cpu, 
  ExternalLink, 
  Users, 
  Radio, 
  FileCode, 
  Zap, 
  Lock, 
  ArrowRight,
  CheckCircle2,
  Bell,
  Search,
  ShoppingCart,
  Building2,
  Sparkles
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<number>(1);

  return (
    <div className="min-h-screen bg-[#0b1c30] text-slate-100 p-4 lg:p-8 flex flex-col pb-24">
      {/* Top Architecture Banner */}
      <div className="max-w-7xl mx-auto w-full space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded bg-[#00685f] text-white text-xs font-bold tracking-wider uppercase">
                Enterprise Blueprint
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Production-Grade Multi-Tenant SaaS Architecture
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              End-to-End System Design: Client Tiers, Edge WAF, Modular Application Services, Event Brokers, and Multi-Tenant Isolation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-emerald-400 font-mono">
              HIPAA & 21 CFR § 1306 Ready
            </span>
          </div>
        </div>

        {/* Business Flow Walkthrough Selector */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              Interactive Architectural Flow Simulation:
            </span>
            <div className="flex gap-1.5">
              {[
                { id: 1, name: 'Flow 1: Drug Search & Checkout' },
                { id: 2, name: 'Flow 2: Pharmacy Catalog Sync' },
                { id: 3, name: 'Flow 3: Clinical Verification & Dispense' }
              ].map((flow) => (
                <button
                  key={flow.id}
                  onClick={() => setActiveFlow(flow.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeFlow === flow.id
                      ? 'bg-[#00685f] text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {flow.name}
                </button>
              ))}
            </div>
          </div>

          {activeFlow === 1 && (
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center space-x-2 overflow-x-auto no-scrollbar font-mono">
              <span className="text-emerald-400 font-bold whitespace-nowrap">Customer Query</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-cyan-400 whitespace-nowrap">Cloudflare CDN + WAF</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-yellow-400 whitespace-nowrap">API Gateway + Redis Cache (Hit 94%)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-purple-400 whitespace-nowrap">Elasticsearch Cluster (AB Rating Match)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-emerald-400 font-bold whitespace-nowrap">Cart Locked &amp; Dispatched</span>
            </div>
          )}

          {activeFlow === 2 && (
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center space-x-2 overflow-x-auto no-scrollbar font-mono">
              <span className="text-cyan-400 font-bold whitespace-nowrap">Pharmacy Partner Ingestion</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-yellow-400 whitespace-nowrap">RabbitMQ / Kafka Event Bus</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-purple-400 whitespace-nowrap">Background Workers (RxNorm Linker)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-red-400 whitespace-nowrap">Price Drift Detector (Alert &gt;15%)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-emerald-400 font-bold whitespace-nowrap">PostgreSQL Multi-Tenant Schema</span>
            </div>
          )}

          {activeFlow === 3 && (
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center space-x-2 overflow-x-auto no-scrollbar font-mono">
              <span className="text-pink-400 font-bold whitespace-nowrap">Patient Rx Upload (PDF/Image)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-yellow-400 whitespace-nowrap">S3 Encrypted Bucket + Gemini OCR Engine</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-cyan-400 whitespace-nowrap">Pharmacist Console Attestation</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-emerald-400 font-bold whitespace-nowrap">Barcoded Cold-Chain Dispatch</span>
            </div>
          )}
        </div>

        {/* Visual Architecture Schematic */}
        <div className="space-y-4">
          {/* Layer 1: Clients & Edge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Clients */}
            <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Tier 1: Client Interfaces &amp; Roles</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Customer Web/Mobile</strong>
                  <span className="text-[11px] text-slate-400">Search, Compare, Rx Upload, Order Tracking</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Medical Store Console</strong>
                  <span className="text-[11px] text-slate-400">Order Queue, Inventory Sync, Clinical Review</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Operations Console</strong>
                  <span className="text-[11px] text-slate-400">Price Drift Mappings, Dispute Handling, SLAs</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Super Admin</strong>
                  <span className="text-[11px] text-slate-400">Global System Config, Emergency Lockout</span>
                </div>
              </div>
            </div>

            {/* Edge & Security */}
            <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Tier 2: Edge &amp; Security Layer</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">DNS &amp; Global CDN</strong>
                  <span className="text-[11px] text-slate-400">Cloudflare Edge &amp; Asset Caching</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">WAF &amp; Rate Limiting</strong>
                  <span className="text-[11px] text-slate-400">DDoS Mitigation, SQLi, Bot Detection</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Application Load Balancer</strong>
                  <span className="text-[11px] text-slate-400">SSL Termination &amp; Dynamic Path Routing</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">API Gateway Proxy</strong>
                  <span className="text-[11px] text-slate-400">JWT Authentication &amp; Multi-Tenant Header</span>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 2: Modular Services Layer */}
          <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <Server className="w-4 h-4" />
              <span>Tier 3: Core Application Services &amp; Domain Monolith</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-white text-xs block">Auth &amp; IAM</strong>
                <p className="text-[10px] text-slate-400">JWT, RBAC, Multi-Tenant context, Refresh tokens</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-white text-xs block">Tenant Management</strong>
                <p className="text-[10px] text-slate-400">Store Onboarding, Licenses, Subscriptions, SLA</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-white text-xs block">Medicine Catalog</strong>
                <p className="text-[10px] text-slate-400">RxNorm, FDA Orange Book, AI Prescription OCR</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-white text-xs block">Order &amp; Billing</strong>
                <p className="text-[10px] text-slate-400">Cart, Live Stock Locks, Commissions, Settlements</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-white text-xs block">Store Operations</strong>
                <p className="text-[10px] text-slate-400">Packing Queue, Courier Handover, Alerts</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-white text-xs block">Notification Engine</strong>
                <p className="text-[10px] text-slate-400">Push, SMS, Surescripts Direct, In-App Alerts</p>
              </div>
            </div>
          </div>

          {/* Layer 3: Asynchronous Workers & Data Stores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Layer */}
            <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs uppercase tracking-wider">
                <Radio className="w-4 h-4" />
                <span>Tier 4: Asynchronous &amp; Event-Driven Layer</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">RabbitMQ Message Broker</strong>
                  <span className="text-[11px] text-slate-400">Async Event Bus &amp; High-Throughput Ingestion</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Background Workers</strong>
                  <span className="text-[11px] text-slate-400">Order Processing, PDF Invoices, Price Sync</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Scheduled Jobs (Cron)</strong>
                  <span className="text-[11px] text-slate-400">15-minute Price Parity &amp; Stock Scrapes</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Dead Letter Queue (DLQ)</strong>
                  <span className="text-[11px] text-slate-400">Failed Message Retry &amp; Exception Escalation</span>
                </div>
              </div>
            </div>

            {/* Persistence & Data Layer */}
            <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Tier 5: Data &amp; Persistence Storage</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">PostgreSQL (Primary DB)</strong>
                  <span className="text-[11px] text-slate-400">Multi-tenant isolation via Row-Level Security</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Redis Cluster</strong>
                  <span className="text-[11px] text-slate-400">Session Storage, Stock Locks, Rapid Lookups</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">Elasticsearch Engine</strong>
                  <span className="text-[11px] text-slate-400">Phonetic Salt Matching &amp; Autocomplete</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-white block">S3 Encrypted Buckets</strong>
                  <span className="text-[11px] text-slate-400">HIPAA-Compliant Prescription Vaults</span>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Tenant Isolation Callout Box */}
          <div className="bg-gradient-to-r from-teal-950/80 to-slate-900 border border-teal-500/40 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Multi-Tenant Data Isolation Guarantee</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every database query automatically injects the verified <code className="bg-black/40 px-1 py-0.5 rounded text-teal-300 font-mono">tenant_id</code> from the cryptographic JWT claims using PostgreSQL Row-Level Security (RLS). Pharmacy hubs are strictly isolated; zero pharmacy partner can access or query another store's private settlement rates or proprietary purchase orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
