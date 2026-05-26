const fs = require('fs');
const currentPath = 'src/components/SectionDivider.jsx';
const prevPath = 'previous-SectionDivider.jsx';
const current = fs.readFileSync(currentPath, 'utf8');
const prev = fs.readFileSync(prevPath, 'utf8');
const curIdx = current.indexOf('Pre-built icon library');
const prevIdx = prev.indexOf('Pre-built icon library');
if (curIdx !== -1 && prevIdx !== -1) {
    const curStart = current.lastIndexOf('/*', curIdx);
    const prevStart = prev.lastIndexOf('/*', prevIdx);
    fs.writeFileSync(currentPath, current.substring(0, curStart) + prev.substring(prevStart));
    console.log('Success');
} else {
    console.log('Indices not found:', curIdx, prevIdx);
}
