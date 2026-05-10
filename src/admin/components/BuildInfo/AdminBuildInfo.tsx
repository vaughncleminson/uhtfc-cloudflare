import packageJson from '../../../../package.json'

const getBuildDetails = () => {
  return {
    version: packageJson.version,
    branch: process.env.NEXT_PUBLIC_GIT_BRANCH || '',
    shortSha: process.env.NEXT_PUBLIC_GIT_SHA || '',
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
      {branch && (
        <div>
          {branch}
          {shortSha ? ` (${shortSha})` : ''}
        </div>
      )}
    </div>
  )
}
