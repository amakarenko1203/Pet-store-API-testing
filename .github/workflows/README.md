# CI/CD Workflows Documentation

This directory contains GitHub Actions workflows for automated testing of the Pet Store API testing project across different environments.

## 🚀 Workflow Overview

### 1. **Development Tests** (`dev-tests.yml`)
- **Schedule**: Every 2 hours on weekdays (Monday-Friday)
- **Purpose**: Frequent testing during active development
- **Features**:
  - Manual trigger with test type selection
  - Configurable test suites (all, user, pet, store)
  - Artifact retention: 7 days
  - Failure notifications

### 2. **QA Environment Tests** (`qa-tests.yml`)
- **Schedule**: Daily at 6 AM UTC (weekdays)
- **Purpose**: Comprehensive testing with parallel execution
- **Features**:
  - Sharded test execution (2 shards)
  - Report merging for unified results
  - Browser selection options
  - Smoke test capability
  - Artifact retention: 14 days (30 days for merged reports)

### 3. **Production Tests** (`prod-tests.yml`)
- **Schedule**: 
  - Twice daily (8 AM & 8 PM UTC) on weekdays
  - Once daily (10 AM UTC) on weekends
- **Purpose**: Critical production monitoring
- **Features**:
  - 3-shard parallel execution for faster runs
  - Critical tests as default (user & pet APIs)
  - Health check validation
  - Extended artifact retention: 30 days (90 days for merged reports)
  - Critical failure notifications

4. **CI - Pull Request Tests** (`ci-tests.yml`)
- **Triggers**: Pull requests and pushes to main branch
- **Purpose**: Continuous integration validation
- **Features**:
  - Multi-Node.js version testing (20, 22)
  - Code linting and type checking
  - Security vulnerability scanning
  - Test result summaries
  - Path-based triggering (only runs when relevant files change)

### 5. **Manual Test Execution** (`manual-tests.yml`)
- **Trigger**: Manual workflow dispatch only
- **Purpose**: On-demand testing with full customization
- **Features**:
  - Environment selection (dev, staging, production)
  - Test suite selection (all, user, pet, store, smoke, critical, custom)
  - Configurable workers (1-5)
  - Retry count options (0-3)
  - Multiple reporter formats (html, json, junit, list, dot)
  - Timeout configuration (15-60 minutes)
  - Custom test pattern support

## 🛠️ Workflow Configuration

### Environment Variables
All workflows use the following environment configuration:
```yaml
env:
  BASE_URL: https://petstore.swagger.io/v2
```

### Node.js Setup
- **Version**: Node.js 22 (latest LTS) with Node.js 20 compatibility testing in CI
- **Package Manager**: npm with caching enabled
- **Playwright**: Auto-installation of browser dependencies

### Test Sharding
- **QA**: 2 shards for balanced execution
- **Production**: 3 shards for faster critical test runs
- **Report Merging**: Automatic merging of sharded results

## 📊 Artifact Management

### Retention Policies
- **Development**: 7 days
- **QA**: 14 days (30 days for merged reports)
- **Production**: 30 days (90 days for merged reports)
- **CI**: 7 days
- **Manual**: 30 days

### Artifact Types
1. **Test Results**: Raw test execution data
2. **HTML Reports**: Playwright HTML reports with screenshots
3. **JSON Reports**: Machine-readable test results
4. **Security Reports**: npm audit results
5. **Merged Reports**: Combined results from sharded executions

## 🔧 Usage Instructions

### Running Manual Tests
1. Go to Actions tab in GitHub repository
2. Select "Manual Test Execution" workflow
3. Click "Run workflow"
4. Configure parameters:
   - **Environment**: Choose target environment
   - **Test Suite**: Select which tests to run
   - **Workers**: Set parallel execution count
   - **Retries**: Configure retry attempts
   - **Reporter**: Choose output format
   - **Timeout**: Set maximum execution time
   - **Custom Pattern**: Specify custom test pattern (if needed)

### Viewing Results
1. **In-Progress**: Check the Actions tab for live execution status
2. **Completed**: Download artifacts from the workflow run page
3. **HTML Reports**: Open `index.html` from downloaded playwright-report artifacts
4. **Test Summary**: View execution summary in the workflow run details

### Customizing Schedules
Edit the `cron` expressions in each workflow file:
```yaml
schedule:
  - cron: '0 6 * * 1-5'  # Daily at 6 AM UTC, weekdays only
```

## 🔍 Monitoring & Notifications

### Success Indicators
- ✅ All test steps complete successfully
- 📊 Artifacts uploaded without errors
- 📈 Test reports generated and merged (for sharded runs)

### Failure Handling
- **Development**: Simple failure notification
- **QA**: Failure notification with report references
- **Production**: Critical failure alerts with immediate attention flags
- **CI**: Summary with detailed step-by-step results

### Health Checks
Production workflows include dedicated health check jobs that:
- Validate test execution results
- Generate pass/fail status
- Trigger critical notifications for production failures

## 📋 Best Practices

1. **Environment-Specific Configurations**: Each environment has tailored settings for appropriate test frequency and thoroughness
2. **Parallel Execution**: Sharding reduces execution time while maintaining comprehensive coverage
3. **Artifact Management**: Retention policies balance storage costs with debugging needs
4. **Manual Override**: Manual workflow provides flexibility for urgent testing needs
5. **Security Integration**: Regular vulnerability scanning in CI pipeline
6. **Multi-Version Testing**: CI tests against multiple Node.js versions for compatibility

## 🚨 Troubleshooting

### Common Issues
1. **Test Failures**: Check HTML reports in artifacts for detailed failure information
2. **Timeout Issues**: Increase timeout in manual workflow or reduce worker count
3. **Artifact Access**: Ensure proper permissions for artifact download
4. **Sharding Problems**: Review individual shard reports before merged results

### Debug Steps
1. Check workflow logs in Actions tab
2. Download and review test artifacts
3. Run tests locally with same configuration
4. Use manual workflow for isolated debugging

## 📅 Schedule Summary

| Environment | Frequency | Days | Times (UTC) |
|-------------|-----------|------|-------------|
| Development | Every 2 hours | Mon-Fri | Business hours |
| QA | Daily | Mon-Fri | 6:00 AM |
| Production | Twice daily | Mon-Fri | 8:00 AM, 8:00 PM |
| Production | Once daily | Sat-Sun | 10:00 AM |
| CI | On-demand | Any | Push/PR events |
| Manual | On-demand | Any | Manual trigger |