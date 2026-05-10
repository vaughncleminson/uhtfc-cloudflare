import packageJson from '../../../../package.json'

const getBuildDetails = () => {
  const branch =
    process.env.NEXT_PUBLIC_GIT_BRANCH ||
    process.env.CF_PAGES_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GIT_BRANCH ||
    'unknown-branch'

  const commitSha =
    process.env.CF_PAGES_COMMIT_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GIT_COMMIT_SHA ||
    ''

  return {
    version: packageJson.version,
    branch,
    shortSha: commitSha ? commitSha.slice(0, 7) : '',
  }
}

export const AdminBuildInfo = () => {
  const { version, branch, shortSha } = getBuildDetails()

  return (
    <div
      style={{
        borderTop: '1px solid var(--theme-elevation-150)',
        color: 'var(--theme-text)',
        fontSize: '12px',
        marginTop: '12px',
        opacity: 0.75,
        paddingTop: '12px',
      }}
    >
      <div>v{version}</div>
      <div>
        {branch}
        {shortSha ? ` (${shortSha})` : ''}
      </div>
    </div>
  )
}
