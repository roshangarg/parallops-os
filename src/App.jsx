import Header from './components/Header'
import Hero from './components/Hero'
import ProblemSection from './components/ProblemSection'
import FeaturesSection from './components/FeaturesSection'
import ArchitectureSection from './components/ArchitectureSection'
import SeeDeeperSection from './components/SeeDeeperSection'
import LifecycleSection from './components/LifecycleSection'
import ExecutionTrailSection from './components/ExecutionTrailSection'
import FlowerSection from './components/FlowerSection'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-main-content">
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <ArchitectureSection />
        <SeeDeeperSection />
        <LifecycleSection />
        <ExecutionTrailSection />
        <FlowerSection />
      </div>
      <Footer />
    </div>
  )
}

export default App
