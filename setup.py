from setuptools import setup, find_packages

setup(
    name="phone-control-project",
    version="2.5.0",
    description="Cross-Platform Android Phone Control & Wireless Screen Mirroring",
    author="JTG Systems",
    author_email="jtgsystems@gmail.com",
    url="https://jtgsystems.com",
    packages=find_packages(),
    entry_points={
        "console_scripts": [
            "phone-control=phone_control.cli:main",
            "pcp=phone_control.cli:main",
        ],
    },
)
