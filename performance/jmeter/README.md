# JMeter Performance Tests

Test plans built with [Apache JMeter](https://jmeter.apache.org).

## Setup

JMeter requires Java 8+:

```powershell
winget install EclipseAdoptium.Temurin.21.JRE
```

Then download JMeter from https://jmeter.apache.org/download_jmeter.cgi and
extract it. Launch the GUI with `bin\jmeter.bat` (design mode) and run tests
from the CLI (recommended for real measurements):

```powershell
jmeter -n -t test-plan.jmx -l results.jtl -e -o report/
```

## Planned test plans

- [ ] API load test: thread group + HTTP samplers + JSON assertions
- [ ] Parameterised test data with CSV Data Set Config
- [ ] Response-time listener + HTML dashboard report
- [ ] Same scenario as `../k6/smoke-api.js` for a k6-vs-JMeter comparison

> ⚠️ Only run load tests against systems you own or have explicit permission
> to test.
