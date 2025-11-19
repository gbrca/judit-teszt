import { useState } from 'react'
import './App.css'

function App() {
  // Shopping cart state
  const [cart, setCart] = useState([
    { id: 1, name: 'Laptop', price: 1000, quantity: 1 },
    { id: 2, name: 'Mouse', price: 50, quantity: 2 },
    { id: 3, name: 'Keyboard', price: 150, quantity: 1 },
  ])
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  // AI Testing state
  const [testResults, setTestResults] = useState([])
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testStats, setTestStats] = useState({ passed: 0, failed: 0, total: 0 })

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // BUG: Discount calculation is wrong - divides by 1000 instead of 100
  // 10% discount should be subtotal * 0.10, but this calculates subtotal * 0.01
  const discountAmount = subtotal * (appliedDiscount / 1000) // BUG HERE!
  const total = subtotal - discountAmount

  // Apply discount code
  const applyDiscount = () => {
    if (discountCode === 'SAVE10') {
      setAppliedDiscount(10)
    } else if (discountCode === 'SAVE20') {
      setAppliedDiscount(20)
    } else {
      setAppliedDiscount(0)
    }
  }

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 0) return
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  // AI-assisted testing simulation
  const runAITests = async () => {
    setIsTestRunning(true)
    setTestResults([])
    const results = []

    // Test 1: Subtotal calculation
    await delay(500)
    const expectedSubtotal = 1000 * 1 + 50 * 2 + 150 * 1
    const test1Pass = subtotal === expectedSubtotal
    results.push({
      name: 'Subtotal Calculation',
      status: test1Pass ? 'PASSED' : 'FAILED',
      expected: expectedSubtotal,
      actual: subtotal,
      aiSuggestion: test1Pass
        ? 'Subtotal correctly sums all items.'
        : 'AI detected: Subtotal calculation error.'
    })
    setTestResults([...results])

    // Test 2: Discount code validation
    await delay(500)
    const test2Pass = discountCode === '' || ['SAVE10', 'SAVE20'].includes(discountCode) || appliedDiscount === 0
    results.push({
      name: 'Discount Code Validation',
      status: 'PASSED',
      expected: 'Valid codes accepted',
      actual: 'Validation working',
      aiSuggestion: 'Discount codes are properly validated.'
    })
    setTestResults([...results])

    // Test 3: 10% Discount calculation - THIS WILL FAIL
    await delay(500)
    const testSubtotal = 1250 // Current subtotal
    const expectedDiscount10 = testSubtotal * 0.10 // Should be 125
    const actualDiscount10 = testSubtotal * (10 / 1000) // Bug: gives 12.5
    const test3Pass = Math.abs(expectedDiscount10 - actualDiscount10) < 0.01
    results.push({
      name: '10% Discount Calculation',
      status: test3Pass ? 'PASSED' : 'FAILED',
      expected: `${expectedDiscount10} Ft`,
      actual: `${actualDiscount10} Ft`,
      aiSuggestion: test3Pass
        ? 'Discount calculated correctly.'
        : '🔴 AI detected BUG: Discount divides by 1000 instead of 100! Line 23 in App.jsx needs fix: change /1000 to /100'
    })
    setTestResults([...results])

    // Test 4: Total calculation
    await delay(500)
    const expectedTotal = testSubtotal - expectedDiscount10
    const actualTotal = testSubtotal - actualDiscount10
    const test4Pass = appliedDiscount === 0 || Math.abs(expectedTotal - actualTotal) < 0.01
    results.push({
      name: 'Final Total Calculation',
      status: appliedDiscount > 0 && !test4Pass ? 'FAILED' : 'PASSED',
      expected: appliedDiscount > 0 ? `${expectedTotal} Ft` : 'N/A',
      actual: appliedDiscount > 0 ? `${actualTotal} Ft` : 'No discount applied',
      aiSuggestion: appliedDiscount > 0 && !test4Pass
        ? '🔴 Total is incorrect due to discount calculation bug.'
        : 'Total calculation logic is correct when no discount applied.'
    })
    setTestResults([...results])

    // Test 5: Quantity update
    await delay(500)
    results.push({
      name: 'Quantity Update Function',
      status: 'PASSED',
      expected: 'Quantities update correctly',
      actual: 'Update function working',
      aiSuggestion: 'Quantity updates are handled properly with validation.'
    })
    setTestResults([...results])

    // Test 6: Negative quantity prevention
    await delay(500)
    results.push({
      name: 'Negative Quantity Prevention',
      status: 'PASSED',
      expected: 'Negative values blocked',
      actual: 'Validation active',
      aiSuggestion: 'Negative quantities are correctly prevented.'
    })
    setTestResults([...results])

    // Calculate stats
    const passed = results.filter(r => r.status === 'PASSED').length
    const failed = results.filter(r => r.status === 'FAILED').length
    setTestStats({ passed, failed, total: results.length })
    setIsTestRunning(false)
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  return (
    <div className="app-container">
      <h1>🛒 Shopping Cart - AI Testing Demo</h1>

      <div className="main-content">
        {/* Shopping Cart Section */}
        <div className="cart-section">
          <h2>Shopping Cart</h2>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price} Ft</td>
                  <td>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </td>
                  <td>{item.price * item.quantity} Ft</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="discount-section">
            <input
              type="text"
              placeholder="Discount code (SAVE10 or SAVE20)"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button onClick={applyDiscount}>Apply</button>
          </div>

          <div className="totals">
            <p>Subtotal: <strong>{subtotal} Ft</strong></p>
            {appliedDiscount > 0 && (
              <p className="discount">
                Discount ({appliedDiscount}%): <strong>-{discountAmount.toFixed(2)} Ft</strong>
              </p>
            )}
            <p className="total">Total: <strong>{total.toFixed(2)} Ft</strong></p>
          </div>
        </div>

        {/* AI Testing Section */}
        <div className="testing-section">
          <h2>🤖 AI-Assisted Testing</h2>

          <button
            className="run-tests-btn"
            onClick={runAITests}
            disabled={isTestRunning}
          >
            {isTestRunning ? 'Running Tests...' : 'Run AI Tests'}
          </button>

          {testResults.length > 0 && (
            <>
              <div className="test-stats">
                <h3>Test Statistics</h3>
                <div className="stats-grid">
                  <div className="stat passed">
                    <span className="stat-number">{testStats.passed}</span>
                    <span className="stat-label">Passed</span>
                  </div>
                  <div className="stat failed">
                    <span className="stat-number">{testStats.failed}</span>
                    <span className="stat-label">Failed</span>
                  </div>
                  <div className="stat total">
                    <span className="stat-number">{testStats.total}</span>
                    <span className="stat-label">Total</span>
                  </div>
                </div>
                {testStats.failed > 0 && (
                  <p className="bug-alert">
                    ⚠️ {testStats.failed} bug(s) detected! Check AI suggestions below.
                  </p>
                )}
              </div>

              <div className="test-results">
                <h3>Test Results</h3>
                {testResults.map((result, index) => (
                  <div key={index} className={`test-item ${result.status.toLowerCase()}`}>
                    <div className="test-header">
                      <span className="test-name">{result.name}</span>
                      <span className={`test-status ${result.status.toLowerCase()}`}>
                        {result.status}
                      </span>
                    </div>
                    <div className="test-details">
                      <p><strong>Expected:</strong> {result.expected}</p>
                      <p><strong>Actual:</strong> {result.actual}</p>
                      <p className="ai-suggestion">
                        <strong>AI Suggestion:</strong> {result.aiSuggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
