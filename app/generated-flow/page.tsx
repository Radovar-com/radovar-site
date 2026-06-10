import { Button, DatePicker, Dropdown, Status, TextField } from "@/components/ds"

export default function GeneratedFlowPage() {
  return (
    <main className="page-shell">
      <section className="hero-card hero-card--narrow">
        <p className="eyebrow">Generated flow starter</p>
        <h1>Review the generated handoff surface</h1>
        <p className="lede">This starter route uses the workspace DS primitives instead of raw interactive HTML controls.</p>
        <Status tone="info">DS-aware starter primitives are available in this workspace.</Status>
        <form className="flow-form">
          <TextField label="Amount" name="amount" placeholder="250.00" infoText="Use this as a starting point for payment journeys." />
          <TextField label="Beneficiary" name="beneficiary" placeholder="UniCredit Savings" />
          <Dropdown
            label="Funding account"
            name="account"
            options={[
              { label: "Everyday account", value: "everyday" },
              { label: "Savings account", value: "savings" },
            ]}
            hint="Starter DS select surface for bounded generation."
          />
          <DatePicker label="Execution date" name="executionDate" hint="Starter DS date field surface." />
          <div className="hero-actions">
            <Button type="submit">Continue</Button>
            <Button type="button" variant="secondary">Save draft</Button>
          </div>
        </form>
      </section>
    </main>
  )
}
