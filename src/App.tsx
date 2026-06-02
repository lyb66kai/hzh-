import { useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  Anchor,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  MapPin,
  Navigation,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Ship,
} from 'lucide-react';

type TabKey = 'monitor' | 'ledger' | 'whitelist' | 'rules';

type Setter = {
  setActiveTab: (tab: TabKey) => void;
};

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('monitor');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <aside className="z-10 flex w-64 shrink-0 flex-col bg-blue-600 text-white shadow-xl">
        <div className="flex items-center gap-3 bg-blue-700 p-4">
          <div className="rounded-lg bg-white p-1.5">
            <Anchor className="text-blue-700" size={24} />
          </div>
          <span className="text-xl font-bold tracking-wider">海智航</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 py-2 text-xs font-semibold uppercase text-blue-200">业务功能</div>
          <nav className="space-y-1">
            <SidebarItem icon={<Navigation size={18} />} text="动态报告管理" />
            <SidebarItem icon={<Ship size={18} />} text="大型船舶靠离泊协助" active />
            <div className="flex flex-col space-y-3 bg-blue-800/30 py-2 pl-11 pr-4 text-sm">
              <button
                className={subNavClass(activeTab === 'monitor' || activeTab === 'ledger')}
                onClick={() => setActiveTab('monitor')}
              >
                拖轮协助监控
              </button>
              <button className={subNavClass(activeTab === 'whitelist')} onClick={() => setActiveTab('whitelist')}>
                拖轮白名单
              </button>
              <button className={subNavClass(activeTab === 'rules')} onClick={() => setActiveTab('rules')}>
                判定规则配置
              </button>
            </div>
            <SidebarItem icon={<ShieldAlert size={18} />} text="违规记录" />
            <SidebarItem icon={<Settings size={18} />} text="基础配置" />
          </nav>
        </div>

        <div className="flex items-center gap-3 bg-blue-700 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 text-sm font-bold">管</div>
          <div className="text-sm">智慧航道管理员</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-700">大型船舶靠离泊协助</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin size={16} /> 杨浦海事局辖区
            </span>
            <div className="h-4 w-px bg-slate-300" />
            <span className="font-medium text-blue-600">当前运行规则: V2.1 (含 140m 以上双拖轮配置)</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {activeTab === 'monitor' && <MonitorTab setActiveTab={setActiveTab} />}
          {activeTab === 'ledger' && <LedgerTab setActiveTab={setActiveTab} />}
          {activeTab === 'whitelist' && <WhitelistTab />}
          {activeTab === 'rules' && <RulesTab />}
        </main>
      </div>
    </div>
  );
}

function MonitorTab({ setActiveTab }: Setter) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="今日监管大船" value="24" unit="艘" color="bg-blue-500" icon={<Ship className="text-white opacity-80" size={28} />} />
        <StatCard title="当前作业中" value="5" unit="艘" color="bg-teal-500" icon={<Clock className="text-white opacity-80" size={28} />} />
        <StatCard title="拖轮应配未配" value="2" unit="起" color="bg-red-500" icon={<AlertTriangle className="text-white opacity-80" size={28} />} />
        <StatCard title="白名单拖轮在线" value="18" unit="艘" color="bg-indigo-500" icon={<CheckCircle className="text-white opacity-80" size={28} />} />
      </div>

      <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex gap-6">
            <h2 className="border-b-2 border-blue-600 pb-1 text-lg font-bold text-slate-800">实时监控列表</h2>
            <button className="pb-1 text-lg font-medium text-slate-400 hover:text-slate-600" onClick={() => setActiveTab('ledger')}>
              协助全过程台账
            </button>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input className="rounded-lg border py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="输入船名或 MMSI" />
            </div>
            <button className="flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              筛选 <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-slate-50 font-medium text-slate-500">
              <tr>
                <Th>目标船舶信息</Th>
                <Th>系统判定依据</Th>
                <Th>拖轮配备 (需配/实配)</Th>
                <Th>全过程状态追踪</Th>
                <Th>当前报警状态</Th>
                <Th center>操作</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <MonitorRow
                tone="red"
                ship="LONG HUA 88"
                meta="MMSI: 413889021 | 拟靠: 上港九区"
                basis={<><div>船长: <span className="font-bold text-red-500">145m</span> (≥140m)</div><div className="text-xs text-slate-500">单车 | 功率: 2800HP</div></>}
                tug="关联: 沪拖08"
                need="需配: 2艘"
                actual="实配: 1艘"
                actualClass="bg-red-100 text-red-700 border-red-200"
                steps={['已接触', '待作业', '待驶离']}
                currentStep={1}
                status={<span className="inline-flex animate-pulse items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700"><ShieldAlert size={12} /> 应配未配 (缺1)</span>}
              />
              <MonitorRow
                tone="slate"
                ship="XIN MING ZHOU"
                meta="MMSI: 412000123 | 拟离: 共青码头"
                basis={<><div>船长: 115m (100-140m)</div><div className="text-xs text-slate-500">单车 | 功率: 2200HP</div></>}
                tug="关联: 复兴2号"
                need="需配: 1艘"
                actual="实配: 1艘"
                actualClass="bg-teal-50 text-teal-700 border-teal-200"
                steps={['已接触', '作业护航中', '待驶离']}
                currentStep={2}
                status={<span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">正常护航</span>}
              />
              <MonitorRow
                tone="orange"
                ship="HAI YANG 19"
                meta="MMSI: 413224090 | 过境"
                basis={<><div>船长: 152m (≥140m)</div><div className="text-xs text-slate-500">单车 | 功率: 4500HP</div></>}
                tug="关联: 沪拖11, 大宇3号"
                need="需配: 2艘"
                actual="实配: 2艘"
                actualClass="bg-orange-50 text-orange-700 border-orange-200"
                steps={['已接触', '作业中', '驶离异常']}
                currentStep={3}
                isError
                status={<span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700"><AlertTriangle size={12} /> 拖轮提前驶离</span>}
              />
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function LedgerTab({ setActiveTab }: Setter) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between rounded-t-xl border-b bg-slate-50 p-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('monitor')} className="text-slate-400 hover:text-blue-600">← 返回实时监控</button>
          <div className="h-4 w-px bg-slate-300" />
          <h2 className="text-lg font-bold text-slate-800">协助全过程台账</h2>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700">
          <Download size={16} /> 导出台账
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="border-b bg-white font-medium text-slate-500">
            <tr>
              <Th>目标船舶</Th>
              <Th>关联拖轮</Th>
              <Th>阶段一: 接触时间与坐标</Th>
              <Th>阶段二: 作业起止时间</Th>
              <Th>阶段三: 驶离时间与坐标</Th>
              <Th>状态/合规</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <LedgerRow ship="YANGTZE FLOWER" desc="船长 120m | 靠泊" tug="沪拖03" status="完全合规" statusClass="border-green-100 bg-green-50 text-green-600" />
            <LedgerRow ship="ZHONG HAI 9" desc="船长 145m | 离泊" tug="大宇5号；未指派第2艘" status="违规记录(应配未配)" statusClass="border-red-100 bg-red-50 text-red-600" />
          </tbody>
        </table>
      </div>
    </section>
  );
}

function WhitelistTab() {
  const rows = [
    ['复兴1号', '413873501', '上海复兴船务', '4000', true],
    ['沪拖08', '413873526', '上海大禹航运', '3200', true],
    ['临港拖7', '412024740', '外协单位', '2800', false],
  ] as const;

  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">常驻拖轮白名单库</h2>
          <p className="mt-1 text-sm text-slate-500">系统优先识别白名单拖轮，作为合法协助力量参与自动匹配。</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-blue-700">
          <Plus size={16} /> 新增白名单
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-600">
            <tr>
              <Th>拖轮名称</Th>
              <Th>MMSI码</Th>
              <Th>所属公司</Th>
              <Th>主机功率 (HP)</Th>
              <Th>自动识别状态</Th>
              <Th>操作</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map(([name, mmsi, company, power, active]) => (
              <tr key={mmsi} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-blue-600">{name}</td>
                <td className="px-6 py-4 text-slate-600">{mmsi}</td>
                <td className="px-6 py-4 text-slate-600">{company}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{power}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 ${active ? 'text-green-600' : 'text-slate-400'}`}>
                    {active && <CheckCircle size={14} />} {active ? '已激活' : '未激活'}
                  </span>
                </td>
                <td className="px-6 py-4 text-blue-600">编辑</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RulesTab() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b pb-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">大型船舶判定与拖轮配置规则</h2>
            <p className="text-sm text-slate-500">设置系统自动抓取大船标准及拖轮匹配数量。</p>
          </div>
          <button className="ml-auto rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">保存规则</button>
        </div>

        <div className="space-y-6">
          <RuleCard title="级别一: 100米以上单车船 (需1拖)" length="100" tugCount="1" />
          <RuleCard title="级别二: 140米以上单车船 (需2拖)" length="140" tugCount="2" featured />
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600">
            <Plus size={16} /> 添加自定义规则判定
          </button>
        </div>
      </section>
    </div>
  );
}

function RuleCard({ title, length, tugCount, featured = false }: { title: string; length: string; tugCount: string; featured?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border p-5 ${featured ? 'border-blue-200 bg-slate-50 ring-1 ring-blue-100' : 'border-slate-200 bg-slate-50'}`}>
      {featured && <div className="absolute right-0 top-0 rounded-bl-lg bg-blue-500 px-2 py-1 text-[10px] font-bold text-white">重点关注规则</div>}
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-base font-bold ${featured ? 'text-blue-800' : 'text-slate-700'}`}>{title}</h3>
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" className="peer sr-only" defaultChecked />
          <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="船长条件 (米)">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">≥</span>
            <input type="number" defaultValue={length} className="w-full rounded border px-3 py-1.5 text-sm" />
          </div>
        </Field>
        <Field label="推进方式">
          <select className="w-full rounded border bg-white px-3 py-1.5 text-sm">
            <option>单车海船</option>
            <option>双车及以上</option>
            <option>不限</option>
          </select>
        </Field>
        <Field label="辅判: 主机功率 (选填)">
          <input type="number" placeholder="不限" className="w-full rounded border bg-white px-3 py-1.5 text-sm" />
        </Field>
      </div>
      <div className="mt-4 border-t border-slate-200 pt-4">
        <label className="mr-4 text-sm font-medium text-slate-700">要求配备拖轮数量:</label>
        <input type="number" defaultValue={tugCount} className={`w-20 rounded border px-3 py-1.5 text-center text-sm font-bold ${featured ? 'text-red-600' : 'text-blue-600'}`} />
        <span className="ml-2 text-sm text-slate-500">艘</span>
      </div>
    </div>
  );
}

function MonitorRow({
  tone,
  ship,
  meta,
  basis,
  tug,
  need,
  actual,
  actualClass,
  steps,
  currentStep,
  status,
  isError = false,
}: {
  tone: 'red' | 'slate' | 'orange';
  ship: string;
  meta: string;
  basis: ReactNode;
  tug: string;
  need: string;
  actual: string;
  actualClass: string;
  steps: string[];
  currentStep: number;
  status: ReactNode;
  isError?: boolean;
}) {
  const hover = tone === 'red' ? 'hover:bg-red-50/30' : tone === 'orange' ? 'hover:bg-orange-50/30' : 'hover:bg-slate-50';
  return (
    <tr className={hover}>
      <td className="px-6 py-4"><div className="font-bold text-blue-600">{ship}</div><div className="text-xs text-slate-500">{meta}</div></td>
      <td className="px-6 py-4 text-slate-700">{basis}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-100 px-2 py-1 text-xs">{need}</span>
          <span className={`rounded border px-2 py-1 text-xs font-bold ${actualClass}`}>{actual}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">{tug}</div>
      </td>
      <td className="px-6 py-4"><StatusStepper currentStep={currentStep} steps={steps} isError={isError} /></td>
      <td className="px-6 py-4">{status}</td>
      <td className="px-6 py-4 text-center"><button className="mr-3 font-medium text-blue-600 hover:text-blue-800">处置</button><button className="text-slate-500 hover:text-slate-700">轨迹</button></td>
    </tr>
  );
}

function LedgerRow({ ship, desc, tug, status, statusClass }: { ship: string; desc: string; tug: string; status: string; statusClass: string }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3"><div className="font-medium text-slate-800">{ship}</div><div className="text-xs text-slate-500">{desc}</div></td>
      <td className="px-4 py-3 text-slate-600">{tug}</td>
      <td className="bg-blue-50/10 px-4 py-3"><div>10:24:15</div><div className="text-xs text-slate-500">121.5432E, 31.2589N</div></td>
      <td className="bg-green-50/10 px-4 py-3"><div>10:35:00 - 11:10:22</div><div className="text-xs text-slate-500">共青码头水域</div></td>
      <td className="bg-indigo-50/10 px-4 py-3"><div>11:15:30</div><div className="text-xs text-slate-500">121.5601E, 31.2650N</div></td>
      <td className="px-4 py-3"><span className={`rounded border px-2 py-1 text-xs font-medium ${statusClass}`}>{status}</span></td>
    </tr>
  );
}

function SidebarItem({ icon, text, active = false }: { icon: ReactNode; text: string; active?: boolean }) {
  return (
    <div className={`flex cursor-pointer items-center gap-3 border-l-4 px-4 py-3 transition-colors ${active ? 'border-white bg-blue-800 font-medium text-white' : 'border-transparent text-blue-100 hover:bg-blue-700'}`}>
      {icon}
      <span className="text-sm">{text}</span>
      {text === '大型船舶靠离泊协助' && <ChevronDown className="ml-auto opacity-70" size={16} />}
    </div>
  );
}

function StatCard({ title, value, unit, color, icon }: { title: string; value: string; unit: string; color: string; icon: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="mb-1 text-sm font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline gap-1"><span className="text-2xl font-bold text-slate-800">{value}</span><span className="text-xs text-slate-500">{unit}</span></div>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg shadow-inner ${color}`}>{icon}</div>
    </div>
  );
}

function StatusStepper({ currentStep, steps, isError = false }: { currentStep: number; steps: string[]; isError?: boolean }) {
  return (
    <div className="flex w-48 items-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep - 1;
        const isErrorStep = isError && isCurrent;
        const nodeColor = isCompleted ? (isErrorStep ? 'bg-orange-500' : 'bg-teal-500') : 'bg-slate-200';
        const textColor = isCompleted ? (isErrorStep ? 'text-orange-700' : 'text-teal-700') : 'text-slate-400';
        return (
          <div className="flex flex-1 items-center" key={step}>
            <div className="relative flex flex-col items-center">
              <div className={`z-10 h-2.5 w-2.5 rounded-full ${nodeColor} ${isCurrent && !isError ? 'ring-2 ring-teal-200' : ''} ${isErrorStep ? 'animate-pulse ring-2 ring-orange-200' : ''}`} />
              <span className={`absolute top-3 mt-1 w-16 text-center text-[10px] font-medium ${textColor}`}>{step}</span>
            </div>
            {index < steps.length - 1 && <div className={`mx-1 h-0.5 flex-1 ${index < currentStep - 1 ? 'bg-teal-500' : 'bg-slate-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function Th({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return <th className={`border-b px-6 py-3 ${center ? 'text-center' : ''}`}>{children}</th>;
}

function subNavClass(active: boolean) {
  return `cursor-pointer text-left ${active ? 'font-medium text-white' : 'text-blue-200 hover:text-white'}`;
}

export default App;
