import { useState, useMemo } from 'react'
import type { Sow, Employee, Project, Lead, UpdateEntry, Contact } from '../../types'
import { Modal } from '../ui/Modal'

type DashboardProps = {
  sows: Sow[]
  employees: Employee[]
  projects: Project[]
  leads: Lead[]
  contacts: Contact[]
  updates: UpdateEntry[]
  onNavigateToSection: (section: string, cardId?: string) => void
}

type ExpandedCard = 'revenue' | 'leads' | 'sow' | 'employee' | 'projects' | null

export function Dashboard({ sows, employees, projects, leads, contacts, updates, onNavigateToSection }: DashboardProps) {
  const [startDate, setStartDate] = useState('2020-01-01') // Day 1
  const [endDate, setEndDate] = useState('2026-02-06') // Current date
  const [selectedCard, setSelectedCard] = useState<ExpandedCard>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: { period: string; revenue: number; cost: number } } | null>(null)
  const [visibleUpdatesCount, setVisibleUpdatesCount] = useState(10)

  const handleShowMoreUpdates = () => {
    setVisibleUpdatesCount(prev => prev + 10)
  }

  // Calculate all metrics
  const metrics = useMemo(() => {
    // SOW Metrics
    const activeSows = sows.filter(s => s.phase === 'In Progress' || s.phase === 'Won')
    const totalSowRevenue = activeSows.reduce((sum, sow) => {
      const value = parseFloat(sow.value.replace(/[$KM,]/g, '')) * (sow.value.includes('M') ? 1000 : 1)
      return sum + value
    }, 0)
    const sowsByPhase = {
      'Lead': { count: 0, cost: 0 },
      'In Progress': { count: 0, cost: 0 },
      'Won': { count: 0, cost: 0 },
      'Completed': { count: 0, cost: 0 },
    }
    
    sows.forEach(sow => {
      const sowCost = sow.entries.reduce((sum, entry) => sum + entry.cost, 0)
      if (sowsByPhase[sow.phase]) {
        sowsByPhase[sow.phase].count++
        sowsByPhase[sow.phase].cost += sowCost
      }
    })

    // Employee Metrics
    const currentEmployees = employees.filter(e => !e.hasLeft)
    const totalHired = employees.length
    const benchedEmployees = currentEmployees.filter(e => 
      e.currentAccounts.toLowerCase().includes('bench') || 
      (e.benchTime !== '0 weeks' && e.benchTime !== '0 months')
    )
    const employeeCost = currentEmployees.reduce((sum, emp) => {
      const salary = parseFloat(emp.salary.replace(/[$K,]/g, ''))
      return sum + salary
    }, 0)
    const employeeRevenue = currentEmployees.reduce((sum, emp) => {
      const sow = parseFloat(emp.sowValuation.replace(/[$K,]/g, ''))
      return sum + sow
    }, 0)

    // Employees per client (from currentAccounts field)
    const employeesPerClient: Record<string, number> = {}
    currentEmployees.forEach(emp => {
      const accounts = emp.currentAccounts.split(',').map(a => a.trim())
      accounts.forEach(account => {
        if (account && account.toLowerCase() !== 'bench' && account.toLowerCase() !== 'n/a') {
          employeesPerClient[account] = (employeesPerClient[account] || 0) + 1
        }
      })
    })

    // Lead Metrics
    const totalLeads = leads.length
    const leadsByPhase = {
      'New': { count: 0, cost: 0 },
      'Qualified': { count: 0, cost: 0 },
      'Proposal': { count: 0, cost: 0 },
      'Negotiation': { count: 0, cost: 0 },
      'Won': { count: 0, cost: 0 },
    }
    
    leads.forEach(lead => {
      const leadCost = lead.entries.reduce((sum, entry) => sum + entry.cost, 0)
      if (leadsByPhase[lead.phase as keyof typeof leadsByPhase]) {
        leadsByPhase[lead.phase as keyof typeof leadsByPhase].count++
        leadsByPhase[lead.phase as keyof typeof leadsByPhase].cost += leadCost
      }
    })
    
    const leadCost = Object.values(leadsByPhase).reduce((sum, phase) => sum + phase.cost, 0)

    // Project Metrics
    const currentProjects = projects.filter(p => p.phase !== 'Canceled' && p.phase !== 'Completed')
    const projectsByStatus = {
      'Green': projects.filter(p => p.status === 'Green').length,
      'Yellow': projects.filter(p => p.status === 'Yellow').length,
      'Red': projects.filter(p => p.status === 'Red').length,
    }
    
    // Calculate employees per project (from teamSize field)
    const employeesPerProject = projects.map(p => {
      const teamSizeMatch = p.teamSize.match(/\d+/g)
      const total = teamSizeMatch ? teamSizeMatch.reduce((sum, num) => sum + parseInt(num), 0) : 0
      return { projectName: p.projectName, employees: total }
    })
    
    // Projects per client org
    const projectsPerClient: Record<string, number> = {}
    projects.forEach(p => {
      projectsPerClient[p.orgName] = (projectsPerClient[p.orgName] || 0) + 1
    })
    
    // Projects releasing this month (February 2026)
    const currentMonth = '2026-02'
    const deliverablesThisMonth = projects.filter(p => {
      return p.releaseDate.startsWith(currentMonth) && p.phase === 'In Progress'
    }).length

    // Revenue Metrics
    const totalRevenue = totalSowRevenue

    const totalSowCost = Object.values(sowsByPhase).reduce((sum, phase) => sum + phase.cost, 0)
    const totalIncome = totalRevenue - (employeeCost + leadCost + totalSowCost)
    
    return {
      // Revenue
      totalRevenue,
      totalIncome,
      costPerSow: activeSows.length > 0 ? totalSowCost / activeSows.length : 0,
      costPerEmployee: employeeCost / currentEmployees.length,
      totalCost: employeeCost + leadCost + totalSowCost,
      
      // Leads
      leadTotalCost: leadCost,
      leadsByPhase,
      totalLeads,
      
      // SOW
      totalSowRevenue,
      activeSowsCount: activeSows.length,
      sowsByPhase,
      
      // Projects
      totalProjects: currentProjects.length,
      projectsByStatus,
      employeesPerProject,
      projectsPerClient,
      deliverablesThisMonth,
      
      // Employees
      totalHired,
      currentEmployees: currentEmployees.length,
      benchedEmployees: benchedEmployees.length,
      employeesPerClient,
      employeeCost,
      employeeRevenue,
      costPerEmployeeUnit: employeeCost / currentEmployees.length,
      revenuePerEmployee: employeeRevenue / currentEmployees.length,
      costPerBenchedEmployee: employeeCost / (benchedEmployees.length || 1),
      
      // Directors Metrics (My Company's Directors Only)
      directorMetrics: (() => {
        // First, find all my company contacts from leads
        const myCompanyContactIds = new Set<string>()
        leads.forEach(lead => {
          lead.myCompanySideContacts.forEach(id => myCompanyContactIds.add(id))
        })
        
        // Filter to only directors/leadership from MY company who are in myCompanySideContacts
        const directors = contacts.filter(c => {
          const isLeadership = c.title.toLowerCase().includes('director') || 
            c.title.toLowerCase().includes('vp') || 
            c.title.toLowerCase().includes('svp') ||
            c.title.toLowerCase().includes('cto') ||
            c.title.toLowerCase().includes('cio')
          
          // Only include if they're in myCompanySideContacts (not client side)
          return isLeadership && myCompanyContactIds.has(c.id)
        })
        
        return directors.map(director => {
          // Find all leads where this director is involved on MY company side
          const directorLeads = leads.filter(lead => 
            lead.myCompanySideContacts.includes(director.id)
          )
          
          const leadDetails = directorLeads.map(lead => {
            // Calculate total cost from entries
            const leadCost = lead.entries.reduce((sum, entry) => sum + entry.cost, 0)
            
            // Parse revenue estimate
            const revenue = parseFloat(lead.revenueEstimate.replace(/[$KM,]/g, '')) * (lead.revenueEstimate.includes('M') ? 1000 : 1)
            
            return {
              leadId: lead.id,
              leadName: lead.leadName,
              cost: leadCost,
              revenue: revenue,
              phase: lead.phase
            }
          })
          
          const totalCost = leadDetails.reduce((sum, ld) => sum + ld.cost, 0)
          const totalRevenue = leadDetails.reduce((sum, ld) => sum + ld.revenue, 0)
          
          return {
            directorId: director.id,
            directorName: director.fullName,
            directorTitle: director.title,
            directorCompany: director.company,
            leadDetails,
            totalCost,
            totalRevenue,
            leadCount: directorLeads.length
          }
        }).filter(dm => dm.leadCount > 0) // Only show directors with leads
      })()
    }
  }, [sows, employees, leads, contacts])

  // Historical data for charts (simulated from day 1)
  const historicalData = useMemo(() => {
    const data = []
    const startYear = 2020
    const endYear = 2026
    
    for (let year = startYear; year <= endYear; year++) {
      const months = year === endYear ? 2 : 12 // Only Jan-Feb for 2026
      for (let month = 1; month <= months; month++) {
        const baseRevenue = 80 + (year - startYear) * 15 + month * 2
        const baseCost = 50 + (year - startYear) * 10 + month * 1.5
        
        data.push({
          period: `${year}-${String(month).padStart(2, '0')}`,
          revenue: baseRevenue + Math.random() * 20,
          cost: baseCost + Math.random() * 10,
        })
      }
    }
    
    return data
  }, [])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h2>Dashboard Overview</h2>
          <p className="muted">Real-time business intelligence and analytics</p>
        </div>
        
        <div className="dashboard-controls">
          <div className="date-range-picker">
            <label>
              <span>From:</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              <span>To:</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="dashboard-cards">
        {/* Revenue Card */}
        <button 
          className="mini-card"
          onClick={() => setSelectedCard('revenue')}
        >
          <p className="mini-title">Revenue</p>
          <p className="card-main-value">${(metrics.totalRevenue / 1000).toFixed(2)}M</p>
        </button>

        {/* Leads Card */}
        <button 
          className="mini-card dashboard-stat-card leads-card"
          onClick={() => setSelectedCard('leads')}
        >
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <p className="mini-title">Leads</p>
            <p className="card-main-value">{metrics.totalLeads}</p>
            <p className="card-subtitle">{Object.values(metrics.leadsByPhase).filter(p => p.count > 0).length} phases active</p>
          </div>
        </button>

        {/* SOW Card */}
        <button 
          className="mini-card dashboard-stat-card sow-card"
          onClick={() => setSelectedCard('sow')}
        >
          <div className="card-icon">📄</div>
          <div className="card-content">
            <p className="mini-title">SOW</p>
            <p className="card-main-value">{metrics.activeSowsCount}</p>
            <p className="card-subtitle">${(metrics.totalSowRevenue / 1000).toFixed(1)}M revenue</p>
          </div>
        </button>

        {/* Employee Card */}
        <button 
          className="mini-card dashboard-stat-card employees-card"
          onClick={() => setSelectedCard('employee')}
        >
          <div className="card-icon">💼</div>
          <div className="card-content">
            <p className="mini-title">Employees</p>
            <p className="card-main-value">{metrics.currentEmployees}</p>
            <p className="card-subtitle">{metrics.benchedEmployees} on bench</p>
          </div>
        </button>

        {/* Projects Card */}
        <button 
          className="mini-card dashboard-stat-card projects-card"
          onClick={() => setSelectedCard('projects')}
        >
          <div className="card-icon">🚀</div>
          <div className="card-content">
            <p className="mini-title">Projects</p>
            <p className="card-main-value">{metrics.totalProjects}</p>
            <p className="card-subtitle">{metrics.projectsByStatus.Green} green · {metrics.projectsByStatus.Yellow} yellow · {metrics.projectsByStatus.Red} red</p>
          </div>
        </button>
      </div>

      {/* Modals for each card type */}
      <Modal
        isOpen={selectedCard === 'revenue'}
        onClose={() => setSelectedCard(null)}
        title="Revenue Details"
      >
        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-label">Total Revenue</span>
            <span className="detail-value">${(metrics.totalRevenue / 1000).toFixed(2)}M</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Income</span>
            <span className="detail-value" style={{ color: metrics.totalIncome >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              ${(metrics.totalIncome / 1000).toFixed(2)}M
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Cost</span>
            <span className="detail-value">${(metrics.totalCost / 1000).toFixed(2)}M</span>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={selectedCard === 'leads'}
        onClose={() => setSelectedCard(null)}
        title="Leads Details"
      >
        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-label">Total Leads</span>
            <span className="detail-value">{metrics.totalLeads}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Cost</span>
            <span className="detail-value">${(metrics.leadTotalCost / 1000).toFixed(2)}K</span>
          </div>
          <div className="detail-section-divider">Leads per Phase (Click to view)</div>
          {Object.entries(metrics.leadsByPhase).map(([phase, data]) => (
            <button
              key={phase}
              className="detail-row detail-row-clickable"
              onClick={() => onNavigateToSection('leads')}
            >
              <span className="detail-label">{phase}</span>
              <div className="detail-value-group">
                <span className="detail-value">{data.count} leads</span>
                <span className="detail-value-secondary">${(data.cost / 1000).toFixed(1)}K cost</span>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={selectedCard === 'sow'}
        onClose={() => setSelectedCard(null)}
        title="SOW Details"
      >
        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-label">Total Revenue</span>
            <span className="detail-value">${(metrics.totalSowRevenue / 1000).toFixed(2)}M</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Active SOWs</span>
            <span className="detail-value">{metrics.activeSowsCount}</span>
          </div>
          <div className="detail-section-divider">SOWs per Phase (Click to view)</div>
          {Object.entries(metrics.sowsByPhase).map(([phase, data]) => (
            <button
              key={phase}
              className="detail-row detail-row-clickable"
              onClick={() => onNavigateToSection('sow')}
            >
              <span className="detail-label">{phase}</span>
              <div className="detail-value-group">
                <span className="detail-value">{data.count} SOWs</span>
                <span className="detail-value-secondary">${(data.cost / 1000).toFixed(1)}K cost</span>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={selectedCard === 'employee'}
        onClose={() => setSelectedCard(null)}
        title="Employee Details"
      >
        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-label">Total Employees Hired</span>
            <span className="detail-value">{metrics.totalHired}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Current Employees</span>
            <span className="detail-value">{metrics.currentEmployees}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Benched Employees</span>
            <span className="detail-value">{metrics.benchedEmployees}</span>
          </div>
          <div className="detail-section-divider">Cost & Revenue Breakdown</div>
          <div className="detail-row">
            <span className="detail-label">Cost per Current Employee</span>
            <span className="detail-value">${metrics.costPerEmployeeUnit.toFixed(0)}K</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Revenue per Current Employee</span>
            <span className="detail-value">${metrics.revenuePerEmployee.toFixed(0)}K</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Cost per Benched Employee</span>
            <span className="detail-value">${metrics.costPerBenchedEmployee.toFixed(0)}K</span>
          </div>
          
          <div className="detail-section-divider">Employees per Client</div>
          {Object.entries(metrics.employeesPerClient)
            .sort((a, b) => b[1] - a[1])
            .map(([client, count]) => (
              <div key={client} className="detail-row">
                <span className="detail-label">{client}</span>
                <span className="detail-value">{count} {count === 1 ? 'employee' : 'employees'}</span>
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        isOpen={selectedCard === 'projects'}
        onClose={() => setSelectedCard(null)}
        title="Projects Details"
      >
        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-label">Total Current Projects</span>
            <span className="detail-value">{metrics.totalProjects}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Deliverables This Month</span>
            <span className="detail-value">{metrics.deliverablesThisMonth}</span>
          </div>
          
          <div className="detail-section-divider">Projects per Status (Click to view)</div>
          {Object.entries(metrics.projectsByStatus).map(([status, count]) => (
            <button
              key={status}
              className="detail-row detail-row-clickable"
              onClick={() => onNavigateToSection('projects')}
            >
              <span className="detail-label">
                <span className={`status-indicator status-${status.toLowerCase()}`}></span>
                {status}
              </span>
              <span className="detail-value">{count} projects</span>
            </button>
          ))}
          
          <div className="detail-section-divider">Employees per Project (Top 5)</div>
          {metrics.employeesPerProject.slice(0, 5).map((item) => (
            <button
              key={item.projectName}
              className="detail-row detail-row-clickable"
              onClick={() => onNavigateToSection('projects')}
            >
              <span className="detail-label">{item.projectName}</span>
              <span className="detail-value">{item.employees} employees</span>
            </button>
          ))}
          
          <div className="detail-section-divider">Projects per Client (Top 5)</div>
          {Object.entries(metrics.projectsPerClient)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([client, count]) => (
              <button
                key={client}
                className="detail-row detail-row-clickable"
                onClick={() => onNavigateToSection('projects')}
              >
                <span className="detail-label">{client}</span>
                <span className="detail-value">{count} projects</span>
              </button>
            ))}
        </div>
      </Modal>

      {/* Revenue and Cost Chart from Day 1 */}
      <div className="chart-section">
        <h3>Revenue & Cost History (From Day 1)</h3>
        <div className="line-chart">
          <div className="chart-container">
            <svg 
              width="100%" 
              height="300" 
              viewBox="0 0 1000 300"
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((percent) => (
                <line
                  key={percent}
                  x1="50"
                  y1={250 - (percent * 2)}
                  x2="950"
                  y2={250 - (percent * 2)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {/* Lines */}
              {(() => {
                const maxValue = Math.max(...historicalData.map(d => Math.max(d.revenue, d.cost)))
                const xStep = 900 / (historicalData.length - 1)
                
                // Revenue line path
                const revenuePath = historicalData.map((item, index) => {
                  const x = 50 + (index * xStep)
                  const y = 250 - ((item.revenue / maxValue) * 200)
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                }).join(' ')

                // Cost line path
                const costPath = historicalData.map((item, index) => {
                  const x = 50 + (index * xStep)
                  const y = 250 - ((item.cost / maxValue) * 200)
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                }).join(' ')

                return (
                  <>
                    {/* Revenue line */}
                    <path
                      d={revenuePath}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Cost line */}
                    <path
                      d={costPath}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Interactive points for revenue */}
                    {historicalData.map((item, index) => {
                      const x = 50 + (index * xStep)
                      const y = 250 - ((item.revenue / maxValue) * 200)
                      return (
                        <circle
                          key={`rev-${index}`}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="var(--color-primary)"
                          stroke="white"
                          strokeWidth="2"
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect()
                            if (rect) {
                              setTooltip({
                                x: rect.left + (x / 1000) * rect.width,
                                y: rect.top + (y / 300) * rect.height,
                                data: item
                              })
                            }
                          }}
                        />
                      )
                    })}

                    {/* Interactive points for cost */}
                    {historicalData.map((item, index) => {
                      const x = 50 + (index * xStep)
                      const y = 250 - ((item.cost / maxValue) * 200)
                      return (
                        <circle
                          key={`cost-${index}`}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#f59e0b"
                          stroke="white"
                          strokeWidth="2"
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect()
                            if (rect) {
                              setTooltip({
                                x: rect.left + (x / 1000) * rect.width,
                                y: rect.top + (y / 300) * rect.height,
                                data: item
                              })
                            }
                          }}
                        />
                      )
                    })}

                    {/* X-axis labels */}
                    {historicalData.map((item, index) => {
                      if (index % 6 !== 0) return null
                      const x = 50 + (index * xStep)
                      return (
                        <text
                          key={`label-${index}`}
                          x={x}
                          y="275"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#6b7280"
                        >
                          {item.period}
                        </text>
                      )
                    })}
                  </>
                )
              })()}
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div 
                className="chart-tooltip"
                style={{
                  position: 'fixed',
                  left: `${tooltip.x}px`,
                  top: `${tooltip.y - 80}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="tooltip-date">{tooltip.data.period}</div>
                <div className="tooltip-row">
                  <span className="tooltip-label revenue">Revenue:</span>
                  <span className="tooltip-value">${tooltip.data.revenue.toFixed(0)}K</span>
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label cost">Cost:</span>
                  <span className="tooltip-value">${tooltip.data.cost.toFixed(0)}K</span>
                </div>
              </div>
            )}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color revenue-color"></span>
              <span>Revenue</span>
            </div>
            <div className="legend-item">
              <span className="legend-color cost-color"></span>
              <span>Cost</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Subsections */}
      <div className="dashboard-subsections">
        {/* Directors & Leadership Subsection (First on mobile) */}
        <div className="dashboard-subsection directors-subsection">
          <div className="subsection-header">
            <h3>Directors & Leadership</h3>
            <p className="subsection-description">Performance metrics for your company's directors engaging with clients</p>
          </div>
          {metrics.directorMetrics.length === 0 ? (
            <div className="no-directors">
              <p>No directors with active client engagements</p>
            </div>
          ) : (
            <div className="directors-list">
              {metrics.directorMetrics.map(director => (
                <div key={director.directorId} className="director-card">
                  <div className="director-header">
                    <div className="director-info">
                      <h4 className="director-name">{director.directorName}</h4>
                      <p className="director-title">{director.directorTitle}</p>
                      <p className="director-company">{director.directorCompany}</p>
                    </div>
                    <div className="director-totals">
                      <div className="director-total-item">
                        <span className="director-total-label">Total Cost</span>
                        <span className="director-total-value cost">${(director.totalCost / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="director-total-item">
                        <span className="director-total-label">Total Revenue</span>
                        <span className="director-total-value revenue">${(director.totalRevenue).toFixed(0)}K</span>
                      </div>
                      <div className="director-total-item">
                        <span className="director-total-label">Leads</span>
                        <span className="director-total-value">{director.leadCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="director-leads">
                    <table className="director-leads-table">
                      <thead>
                        <tr>
                          <th>Lead Name</th>
                          <th>Stage</th>
                          <th>Cost</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {director.leadDetails.map(lead => (
                          <tr key={lead.leadId}>
                            <td className="lead-name">{lead.leadName}</td>
                            <td>
                              <span className={`stage-badge stage-${lead.phase.toLowerCase().replace(' ', '-')}`}>
                                {lead.phase}
                              </span>
                            </td>
                            <td className="cost-value">${(lead.cost / 1000).toFixed(1)}K</td>
                            <td className="revenue-value">${lead.revenue.toFixed(0)}K</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Track Updates Subsection (Second on mobile) */}
        <div className="dashboard-subsection track-updates-subsection">
          <div className="subsection-header">
            <h3>Track Updates</h3>
            <p className="subsection-description">Recent activity across all sections</p>
          </div>
          <div className="updates-list">
            {updates.length === 0 ? (
              <div className="no-updates">
                <p>No recent updates to display</p>
              </div>
            ) : (
              <>
                {updates.slice(0, visibleUpdatesCount).map(update => (
                  <div key={update.id} className="update-item">
                    <div className="update-info">
                      <div className="update-header">
                        <span className="update-user">{update.user}</span>
                        <span className="update-action">{update.action}</span>
                        <span className="update-section">{update.section}</span>
                      </div>
                      <div className="update-details">
                        <button
                          className="update-card-link"
                          onClick={() => onNavigateToSection(update.section.toLowerCase(), update.cardId)}
                        >
                          {update.cardTitle}
                        </button>
                        <span className="update-timestamp">
                          {new Date(update.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {visibleUpdatesCount < updates.length && (
                  <button className="show-more-btn" onClick={handleShowMoreUpdates}>
                    Show More ({updates.length - visibleUpdatesCount} remaining)
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
