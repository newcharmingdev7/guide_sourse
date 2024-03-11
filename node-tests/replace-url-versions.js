const { expect } = require('chai');
const replaceURLVersions = require('../scripts/helpers/replace-url-versions');

describe('replace url versions', function () {
  it('works', function () {
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember/release/',
        '3.15',
        '3.15'
      )
    ).to.equal('https://api.emberjs.com/ember/3.15/');
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember/release',
        '3.15',
        '3.15'
      )
    ).to.equal('https://api.emberjs.com/ember/3.15');
    // the script is idempotent now so will only replace /release/ links
    expect(
      replaceURLVersions('https://api.emberjs.com/ember/3.20/', '3.15', '3.15')
    ).to.equal('https://api.emberjs.com/ember/3.20/');
    expect(
      replaceURLVersions('https://api.emberjs.com/ember/3.20', '3.15', '3.15')
    ).to.equal('https://api.emberjs.com/ember/3.20');
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember/release/classes/Application',
        '3.15',
        '3.15'
      )
    ).to.equal('https://api.emberjs.com/ember/3.15/classes/Application');
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember-data/release/',
        '3.15',
        '3.15'
      )
    ).to.equal('https://api.emberjs.com/ember-data/3.15/');
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember-data/release',
        '3.15',
        '3.15'
      )
    ).to.equal('https://api.emberjs.com/ember-data/3.15');
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember-data/release',
        '3.15',
        '3.12'
      )
    ).to.equal('https://api.emberjs.com/ember-data/3.12');
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember/release',
        '3.15',
        '3.12'
      )
    ).to.equal('https://api.emberjs.com/ember/3.15');
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember-data/release/classes/Model/',
        '3.15',
        '3.15'
      )
    ).to.equal('https://api.emberjs.com/ember-data/3.15/classes/Model/');

    // the script is idempotent now so will only replace /release/ links
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember-data/3.20/classes/Model/',
        '3.15',
        '3.15'
      )
    ).to.equal('https://api.emberjs.com/ember-data/3.20/classes/Model/');
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember-data/3.20/classes/Model/',
        '3.15',
        '3.12'
      )
    ).to.equal('https://api.emberjs.com/ember-data/3.20/classes/Model/');
    expect(
      replaceURLVersions(
        'https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner',
        '3.15',
        '3.15'
      )
    ).to.equal(
      'https://api.emberjs.com/ember/3.15/classes/@ember%2Fapplication/methods/getOwner'
    );
    expect(
      replaceURLVersions(
        'https://guides.emberjs.com/release/getting-started/',
        '3.15',
        '3.15'
      )
    ).to.equal('https://guides.emberjs.com/v3.15.0/getting-started/');
    expect(
      replaceURLVersions(
        'https://guides.emberjs.com/release/getting-started/',
        '3.16.0',
        '3.16.0'
      )
    ).to.equal('https://guides.emberjs.com/v3.16.0/getting-started/');
  });
});