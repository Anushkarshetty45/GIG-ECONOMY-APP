import { useState, useMemo } from 'react'
import { useFinanceStore } from '../store/financeStore'
import { Shield, AlertTriangle, Info, CheckCircle, TrendingUp, DollarSign, Activity, Heart, Car, FileText, Briefcase, Users, Laptop, Lock, Umbrella, Plus } from 'lucide-react'
import './DashboardPages.css'

export default function Insurance() {
  const { insurance, addInsurance, updateInsurance, deleteInsurance, getTotalInsuranceCost, getTotalIncome, getTotalExpenses, expenses, incomes } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedInsurance, setSelectedInsurance] = useState(null)
  const [formData, setFormData] = useState({
    type: 'Health',
    provider: '',
    policyNumber: '',
    monthlyCost: '',
    coverageAmount: '',
    renewalDate: ''
  })

  // Calculate actual monthly averages based on transaction date range
  const { monthlyIncome, monthlyExpenses, dataMonths } = useMemo(() => {
    if (incomes.length === 0 && expenses.length === 0) {
      return { monthlyIncome: 0, monthlyExpenses: 0, dataMonths: 0 }
    }

    // Get all transaction dates
    const allDates = [
      ...incomes.map(i => new Date(i.date)),
      ...expenses.map(e => new Date(e.date))
    ].filter(d => !isNaN(d.getTime()))

    if (allDates.length === 0) {
      return { monthlyIncome: 0, monthlyExpenses: 0, dataMonths: 0 }
    }

    // Find date range
    const earliestDate = new Date(Math.min(...allDates))
    const latestDate = new Date(Math.max(...allDates))

    // Calculate months between dates (including partial months)
    const monthsDiff = (latestDate.getFullYear() - earliestDate.getFullYear()) * 12 +
                       (latestDate.getMonth() - earliestDate.getMonth()) + 1

    const totalIncome = getTotalIncome()
    const totalExpenses = getTotalExpenses()

    return {
      monthlyIncome: monthsDiff > 0 ? totalIncome / monthsDiff : totalIncome,
      monthlyExpenses: monthsDiff > 0 ? totalExpenses / monthsDiff : totalExpenses,
      dataMonths: monthsDiff
    }
  }, [incomes, expenses, getTotalIncome, getTotalExpenses])

  const monthlySavings = monthlyIncome - monthlyExpenses
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0

  // Analyze expense patterns
  const hasCarExpenses = useMemo(() => {
    return expenses.some(e =>
      e.category?.toLowerCase().includes('gas') ||
      e.category?.toLowerCase().includes('car') ||
      e.category?.toLowerCase().includes('vehicle') ||
      e.category?.toLowerCase().includes('auto')
    )
  }, [expenses])

  const hasBusinessEquipment = useMemo(() => {
    return expenses.some(e =>
      e.category?.toLowerCase().includes('equipment') ||
      e.category?.toLowerCase().includes('laptop') ||
      e.category?.toLowerCase().includes('computer')
    )
  }, [expenses])

  // Comprehensive Insurance Types with detailed info and professional icons
  const insuranceTypes = [
    {
      value: 'Health',
      label: 'Health Insurance',
      icon: Heart,
      iconColor: '#ef4444',
      avgCost: 450,
      description: 'Protects you from high medical costs and provides preventive care coverage.',
      whyImportant: 'Medical emergencies can cost tens of thousands of dollars. As a gig worker without employer coverage, this is essential for financial security.',
      coverage: 'Doctor visits, hospital stays, preventive care, prescriptions, emergency services',
      recommended: 'Everyone needs health insurance, especially gig workers without employer benefits',
      getPriority: () => 'high',
      getAffordability: (income) => income >= 2000 ? 'affordable' : income >= 1000 ? 'stretch' : 'difficult'
    },
    {
      value: 'Auto',
      label: 'Auto Insurance',
      icon: Car,
      iconColor: '#3b82f6',
      avgCost: 200,
      description: 'Required by law in most states. Covers vehicle damage, liability, and medical expenses from accidents.',
      whyImportant: 'Legally required for rideshare and delivery drivers. Protects you from devastating financial liability in accidents.',
      coverage: 'Liability, collision, comprehensive, uninsured motorist, medical payments',
      recommended: 'Critical for rideshare/delivery drivers. Standard coverage for personal vehicle owners.',
      getPriority: (hasCarExpenses) => hasCarExpenses ? 'high' : 'medium',
      getAffordability: (income) => income >= 1500 ? 'affordable' : income >= 800 ? 'stretch' : 'difficult'
    },
    {
      value: 'Liability',
      label: 'General Liability Insurance',
      icon: Shield,
      iconColor: '#10b981',
      avgCost: 50,
      description: 'Protects your business from claims of bodily injury, property damage, and personal injury.',
      whyImportant: 'One lawsuit can bankrupt your business. This shields your personal assets from business-related claims.',
      coverage: 'Bodily injury, property damage, advertising injury, legal defense costs',
      recommended: 'Essential for freelancers who work on client sites or interact with customers in person.',
      getPriority: (_, income) => income >= 2000 ? 'high' : 'medium',
      getAffordability: (income) => income >= 1000 ? 'affordable' : income >= 500 ? 'stretch' : 'difficult'
    },
    {
      value: 'Disability',
      label: 'Disability Insurance',
      icon: Briefcase,
      iconColor: '#f59e0b',
      avgCost: 100,
      description: 'Replaces 50-70% of your income if you become unable to work due to illness or injury.',
      whyImportant: 'Your ability to earn income is your most valuable asset. This protects it when you can\'t work.',
      coverage: 'Short-term disability (90 days-1 year), long-term disability (1+ years), partial disability benefits',
      recommended: 'Critical for self-employed individuals without employer disability coverage.',
      getPriority: (_, income) => income >= 3000 ? 'high' : income >= 1500 ? 'medium' : 'low',
      getAffordability: (income) => income >= 2000 ? 'affordable' : income >= 1200 ? 'stretch' : 'difficult'
    },
    {
      value: 'Life',
      label: 'Life Insurance',
      icon: Users,
      iconColor: '#ec4899',
      avgCost: 75,
      description: 'Provides financial support to your dependents if you pass away.',
      whyImportant: 'Ensures your family can maintain their lifestyle and pay off debts if something happens to you.',
      coverage: 'Death benefit, optional living benefits, terminal illness riders, accidental death coverage',
      recommended: 'Essential if you have dependents, mortgage, or significant debt. Less urgent for singles without dependents.',
      getPriority: (_, income, hasDependents) => hasDependents ? 'high' : income >= 3000 ? 'medium' : 'low',
      getAffordability: (income) => income >= 1500 ? 'affordable' : income >= 800 ? 'stretch' : 'difficult'
    },
    {
      value: 'Equipment',
      label: 'Equipment Insurance',
      icon: Laptop,
      iconColor: '#8b5cf6',
      avgCost: 30,
      description: 'Covers your business equipment like computers, cameras, tools, and other work-essential items.',
      whyImportant: 'Replacing expensive work equipment can drain your emergency fund. This ensures you can keep working.',
      coverage: 'Theft, damage, loss of business property, breakdown coverage, replacement cost',
      recommended: 'Important for freelancers with expensive equipment (photographers, videographers, designers, etc.).',
      getPriority: (hasEquipment, income) => hasEquipment && income >= 1500 ? 'medium' : 'low',
      getAffordability: (income) => income >= 1000 ? 'affordable' : income >= 500 ? 'stretch' : 'difficult'
    },
    {
      value: 'Professional',
      label: 'Professional Liability (E&O)',
      icon: FileText,
      iconColor: '#06b6d4',
      avgCost: 65,
      description: 'Protects against claims of negligence, errors, or failure to deliver promised services.',
      whyImportant: 'Even with perfect work, clients can sue. This covers legal costs and settlements from professional mistakes.',
      coverage: 'Errors & omissions, negligence claims, legal defense, court costs, settlements',
      recommended: 'Critical for consultants, accountants, designers, and anyone providing professional advice.',
      getPriority: (_, income) => income >= 2500 ? 'high' : income >= 1500 ? 'medium' : 'low',
      getAffordability: (income) => income >= 1500 ? 'affordable' : income >= 1000 ? 'stretch' : 'difficult'
    },
    {
      value: 'Cyber',
      label: 'Cyber Liability Insurance',
      icon: Lock,
      iconColor: '#14b8a6',
      avgCost: 45,
      description: 'Protects against data breaches, cyber attacks, and digital security incidents.',
      whyImportant: 'Data breaches can result in massive fines and lawsuits. This covers recovery costs and legal fees.',
      coverage: 'Data breach response, cyber extortion, business interruption, legal fees, notification costs',
      recommended: 'Important for businesses that handle sensitive client data or financial information.',
      getPriority: (_, income) => income >= 3000 ? 'medium' : 'low',
      getAffordability: (income) => income >= 1500 ? 'affordable' : income >= 1000 ? 'stretch' : 'difficult'
    },
    {
      value: 'Umbrella',
      label: 'Umbrella Insurance',
      icon: Umbrella,
      iconColor: '#71717a',
      avgCost: 40,
      description: 'Extra liability protection beyond your other insurance policies.',
      whyImportant: 'Provides additional coverage when your auto or homeowner\'s liability limits are exceeded.',
      coverage: 'Excess liability ($1M-$5M), protects personal assets, legal defense costs',
      recommended: 'Good for high earners or those with significant assets to protect.',
      getPriority: (_, income) => income >= 5000 ? 'medium' : 'low',
      getAffordability: (income) => income >= 3000 ? 'affordable' : income >= 2000 ? 'stretch' : 'difficult'
    }
  ]

  // Smart Priority Calculation
  const getSmartPriority = (insuranceType) => {
    const baseIncome = monthlyIncome

    switch(insuranceType.value) {
      case 'Health':
        return 'high'
      case 'Auto':
        return hasCarExpenses ? 'high' : 'medium'
      case 'Liability':
        return baseIncome >= 2000 ? 'high' : 'medium'
      case 'Disability':
        return baseIncome >= 3000 ? 'high' : baseIncome >= 1500 ? 'medium' : 'low'
      case 'Professional':
        return baseIncome >= 2500 ? 'high' : baseIncome >= 1500 ? 'medium' : 'low'
      case 'Life':
        return baseIncome >= 3000 ? 'medium' : 'low'
      case 'Equipment':
        return hasBusinessEquipment && baseIncome >= 1500 ? 'medium' : 'low'
      case 'Cyber':
        return baseIncome >= 3000 ? 'medium' : 'low'
      case 'Umbrella':
        return baseIncome >= 5000 ? 'medium' : 'low'
      default:
        return 'low'
    }
  }

  // Calculate affordability
  const getAffordability = (cost) => {
    if (monthlyIncome === 0) return 'unknown'
    const percentage = (cost / monthlyIncome) * 100
    if (percentage <= 5) return 'affordable'
    if (percentage <= 10) return 'stretch'
    return 'difficult'
  }

  // Categorize insurances by priority
  const categorizedInsurances = useMemo(() => {
    const high = []
    const medium = []
    const low = []

    insuranceTypes.forEach(type => {
      const priority = getSmartPriority(type)
      const hasThis = insurance.some(p => p.type === type.value)
      const affordability = getAffordability(type.avgCost)

      const item = { ...type, priority, hasThis, affordability }

      if (priority === 'high') high.push(item)
      else if (priority === 'medium') medium.push(item)
      else low.push(item)
    })

    return { high, medium, low }
  }, [monthlyIncome, hasCarExpenses, hasBusinessEquipment, insurance])

  const handleSubmit = (e) => {
    e.preventDefault()

    const policyData = {
      type: formData.type,
      provider: formData.provider,
      policyNumber: formData.policyNumber,
      monthlyCost: parseFloat(formData.monthlyCost),
      coverageAmount: formData.coverageAmount,
      renewalDate: formData.renewalDate
    }

    if (editingId) {
      updateInsurance(editingId, policyData)
      setEditingId(null)
    } else {
      addInsurance(policyData)
    }

    setFormData({
      type: 'Health',
      provider: '',
      policyNumber: '',
      monthlyCost: '',
      coverageAmount: '',
      renewalDate: ''
    })
    setShowForm(false)
  }

  const handleEdit = (policy) => {
    setFormData({
      type: policy.type,
      provider: policy.provider,
      policyNumber: policy.policyNumber || '',
      monthlyCost: policy.monthlyCost.toString(),
      coverageAmount: policy.coverageAmount || '',
      renewalDate: policy.renewalDate || ''
    })
    setEditingId(policy.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      type: 'Health',
      provider: '',
      policyNumber: '',
      monthlyCost: '',
      coverageAmount: '',
      renewalDate: ''
    })
  }

  const totalMonthlyCost = getTotalInsuranceCost()
  const totalAnnualCost = totalMonthlyCost * 12
  const activePolicies = insurance.length
  const insuranceBudgetPercentage = monthlyIncome > 0 ? (totalMonthlyCost / monthlyIncome) * 100 : 0

  const getTypeInfo = (type) => {
    return insuranceTypes.find(t => t.value === type) || insuranceTypes[0]
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#71717a'
      default: return '#71717a'
    }
  }

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertTriangle size={16} />
      case 'medium': return <Info size={16} />
      case 'low': return <Activity size={16} />
      default: return <Info size={16} />
    }
  }

  const getAffordabilityColor = (affordability) => {
    switch(affordability) {
      case 'affordable': return '#10b981'
      case 'stretch': return '#f59e0b'
      case 'difficult': return '#ef4444'
      default: return '#71717a'
    }
  }

  const renderInsuranceCard = (type) => {
    const IconComponent = type.icon

    return (
      <div
        key={type.value}
        style={{
          background: type.hasThis
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
            : 'var(--theme-card)',
          border: `1px solid ${type.hasThis ? 'rgba(16, 185, 129, 0.3)' : 'var(--theme-border)'}`,
          borderRadius: '16px',
          padding: '24px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={() => setSelectedInsurance(selectedInsurance?.value === type.value ? null : type)}
      >
        {/* Priority Badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          background: 'var(--theme-background)',
          border: '1px solid var(--theme-border)',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          color: getPriorityColor(type.priority),
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {getPriorityIcon(type.priority)}
          {type.priority} Priority
        </div>

        {/* Icon and Checkmark */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: `${type.iconColor}15`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconComponent size={28} color={type.iconColor} strokeWidth={2} />
          </div>
          {type.hasThis && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '50%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={24} color="#10b981" />
            </div>
          )}
        </div>

      {/* Title */}
      <h3 style={{
        fontSize: '20px',
        fontWeight: '700',
        color: 'var(--theme-text)',
        marginBottom: '8px',
        letterSpacing: '-0.01em'
      }}>
        {type.label}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '14px',
        color: 'var(--theme-text-secondary)',
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        {type.description}
      </p>

      {/* Cost & Affordability */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '12px',
        background: 'var(--theme-background)',
        border: '1px solid var(--theme-border)',
        borderRadius: '10px'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)', marginBottom: '4px' }}>Avg. Cost</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--theme-text)' }}>
            ${type.avgCost}/mo
          </div>
        </div>
        <div style={{
          padding: '6px 12px',
          background: `${getAffordabilityColor(type.affordability)}20`,
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          color: getAffordabilityColor(type.affordability),
          textTransform: 'capitalize'
        }}>
          {type.affordability === 'affordable' && '✓ Affordable'}
          {type.affordability === 'stretch' && '⚠ Stretch Budget'}
          {type.affordability === 'difficult' && '✗ Over Budget'}
          {type.affordability === 'unknown' && 'Unknown'}
        </div>
      </div>

      {/* Expanded Details */}
      {selectedInsurance?.value === type.value && (
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid var(--theme-border)'
        }}>
          <div style={{
            marginBottom: '16px',
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.05)',
            borderLeft: '3px solid #10b981',
            borderRadius: '8px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--theme-success)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <Info size={16} />
              Why It's Important
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--theme-text-secondary)', lineHeight: '1.6' }}>
              {type.whyImportant}
            </p>
          </div>

          <div style={{
            marginBottom: '16px',
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.05)',
            borderLeft: '3px solid #3b82f6',
            borderRadius: '8px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <CheckCircle size={16} />
              What's Covered
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--theme-text-secondary)', lineHeight: '1.6' }}>
              {type.coverage}
            </p>
          </div>

          <div style={{
            marginBottom: '0',
            padding: '16px',
            background: 'rgba(245, 158, 11, 0.05)',
            borderLeft: '3px solid #f59e0b',
            borderRadius: '8px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <TrendingUp size={16} />
              Recommendation
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--theme-text-secondary)', lineHeight: '1.6' }}>
              {type.recommended}
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!type.hasThis && (
        <button
          className="btn-submit"
          onClick={(e) => {
            e.stopPropagation()
            setFormData({ ...formData, type: type.value, monthlyCost: type.avgCost.toString() })
            setShowForm(true)
          }}
          style={{
            width: '100%',
            marginTop: '16px',
            background: 'linear-gradient(135deg, #52525b 0%, #71717a 100%)',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} />
          Add This Policy
        </button>
      )}
    </div>
    )
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          color: 'var(--theme-text)',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          letterSpacing: '-0.02em'
        }}>
          <Shield size={36} strokeWidth={2.5} /> Smart Insurance Advisor
        </h1>
        <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '15px', marginLeft: '48px' }}>
          AI-powered recommendations based on your income and expenses
        </p>
      </div>

      {/* Financial Overview */}
      <div style={{
        marginBottom: '32px',
        padding: '24px',
        background: 'var(--theme-surface)',
        border: '1px solid var(--theme-border)',
        borderRadius: '16px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--theme-text)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <TrendingUp size={20} />
          Your Financial Snapshot
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)', marginBottom: '4px' }}>Monthly Income</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--theme-success)' }}>
              ${monthlyIncome.toFixed(0)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)', marginBottom: '4px' }}>Monthly Expenses</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--theme-error)' }}>
              ${monthlyExpenses.toFixed(0)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)', marginBottom: '4px' }}>Insurance Budget</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--theme-info)' }}>
              ${totalMonthlyCost.toFixed(0)}/mo
              <span style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)', marginLeft: '4px' }}>
                ({insuranceBudgetPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)', marginBottom: '4px' }}>Savings Rate</div>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: savingsRate >= 20 ? '#10b981' : savingsRate >= 10 ? '#f59e0b' : '#ef4444'
            }}>
              {savingsRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards" style={{ marginBottom: '32px' }}>
        <div className="summary-card">
          <div className="card-label">Active Policies</div>
          <div className="card-value" style={{ color: 'var(--theme-success)' }}>{activePolicies}</div>
          <div className="card-sublabel">Insurance types</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Monthly Cost</div>
          <div className="card-value" style={{ color: 'var(--theme-text-tertiary)' }}>${totalMonthlyCost.toFixed(2)}</div>
          <div className="card-sublabel">Per month</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Annual Cost</div>
          <div className="card-value" style={{ color: 'var(--theme-info)' }}>${totalAnnualCost.toFixed(2)}</div>
          <div className="card-sublabel">Per year</div>
        </div>
        <div className="summary-card">
          <div className="card-label">High Priority</div>
          <div className="card-value" style={{ color: 'var(--theme-error)' }}>
            {categorizedInsurances.high.filter(i => !i.hasThis).length}
          </div>
          <div className="card-sublabel">Recommendations</div>
        </div>
      </div>

      {/* Add Policy Button */}
      <button
        className="action-button"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '32px' }}
      >
        {showForm ? 'Cancel' : '+ Add Insurance Policy'}
      </button>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="form-container" style={{ marginBottom: '32px' }}>
          <h2 className="section-title" style={{ marginBottom: '24px' }}>
            {editingId ? 'Edit Policy' : 'Add Insurance Policy'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>
            <div className="form-field" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--theme-text-secondary)' }}>
                Insurance Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                style={{ width: '100%' }}
              >
                {insuranceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} - ${type.avgCost}/mo avg
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--theme-text-secondary)' }}>
                Provider *
              </label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., Blue Cross Blue Shield"
                required
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>
            <div className="form-field" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--theme-text-secondary)' }}>
                Policy Number (Optional)
              </label>
              <input
                type="text"
                value={formData.policyNumber}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                placeholder="e.g., POL-123456"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-field" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--theme-text-secondary)' }}>
                Monthly Cost *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyCost}
                onChange={(e) => setFormData({ ...formData, monthlyCost: e.target.value })}
                placeholder="0.00"
                required
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', alignItems: 'start' }}>
            <div className="form-field" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--theme-text-secondary)' }}>
                Coverage Amount/Details (Optional)
              </label>
              <input
                type="text"
                value={formData.coverageAmount}
                onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                placeholder="e.g., $500k coverage"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-field" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--theme-text-secondary)' }}>
                Renewal Date (Optional)
              </label>
              <input
                type="date"
                value={formData.renewalDate}
                onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editingId ? 'Update Policy' : 'Add Policy'}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* My Current Policies */}
      {insurance.length > 0 && (
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} />
            My Current Policies
          </h2>
          <div className="data-list">
            {insurance.map((policy) => {
              const typeInfo = getTypeInfo(policy.type)
              const priority = getSmartPriority(typeInfo)
              const IconComponent = typeInfo.icon
              return (
                <div key={policy.id} className="data-item">
                  <div className="item-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: `${typeInfo.iconColor}15`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComponent size={24} color={typeInfo.iconColor} strokeWidth={2} />
                      </div>
                      <div>
                        <div className="item-title" style={{ fontSize: '18px', fontWeight: '600' }}>
                          {typeInfo.label}
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--theme-text-tertiary)', marginTop: '8px' }}>
                          ${policy.monthlyCost.toFixed(2)}/mo
                        </div>
                        <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
                          ${(policy.monthlyCost * 12).toFixed(2)}/year
                        </div>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit" onClick={() => handleEdit(policy)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteInsurance(policy.id)}>Delete</button>
                    </div>
                  </div>
                  <div className="item-details">
                    <div className="item-detail"><strong>Provider:</strong> {policy.provider}</div>
                    {policy.policyNumber && (
                      <div className="item-detail"><strong>Policy:</strong> {policy.policyNumber}</div>
                    )}
                    {policy.coverageAmount && (
                      <div className="item-detail"><strong>Coverage:</strong> {policy.coverageAmount}</div>
                    )}
                    {policy.renewalDate && (
                      <div className="item-detail">
                        <strong>Renewal:</strong> {new Date(policy.renewalDate).toLocaleDateString()}
                      </div>
                    )}
                    <div className="item-detail">
                      <strong>Priority:</strong>{' '}
                      <span style={{
                        color: getPriorityColor(priority),
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {priority}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* High Priority Recommendations */}
      {categorizedInsurances.high.length > 0 && (
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2 className="section-title" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--theme-error)'
          }}>
            <AlertTriangle size={20} />
            High Priority - Essential Coverage
          </h2>
          <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
            These insurance types are critical for your financial protection. Strongly recommended based on your income of ${monthlyIncome.toFixed(0)}/month.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {categorizedInsurances.high.map(renderInsuranceCard)}
          </div>
        </div>
      )}

      {/* Medium Priority Recommendations */}
      {categorizedInsurances.medium.length > 0 && (
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2 className="section-title" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#f59e0b'
          }}>
            <Info size={20} />
            Medium Priority - Important Protection
          </h2>
          <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
            These policies provide valuable protection and should be considered as your business grows.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {categorizedInsurances.medium.map(renderInsuranceCard)}
          </div>
        </div>
      )}

      {/* Low Priority Recommendations */}
      {categorizedInsurances.low.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--theme-text-tertiary)'
          }}>
            <Activity size={20} />
            Low Priority - Optional Coverage
          </h2>
          <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
            These are optional coverages that may become more relevant as your income increases.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {categorizedInsurances.low.map(renderInsuranceCard)}
          </div>
        </div>
      )}
    </div>
  )
}
